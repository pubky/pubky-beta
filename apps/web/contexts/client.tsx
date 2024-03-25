/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

export * from '@pubky/common';

import z32 from 'z32';

import { argon2id } from 'hash-wasm';
import Client from '@pubky/sdk';

const TEST_HOMESERVER =
  'pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo';
const TEST_PKARR_RELAY = 'http://localhost:7258';

type AuthContextType = {
  signUp: () => Promise<string>;
  logout: () => Promise<void>;
  getProfile: () => Promise<any>;
  saveProfile: (profile: any) => Promise<void>;
  createPost: (post: any) => Promise<any>;
  isLoggedIn: () => Promise<boolean>;
  listPosts: (pubky: string) => Promise<any>;
  getPost: (uri: string) => Promise<any>;
  getUser: (pk: string) => Promise<any>;
  pubkey: string | null;
};

const ClientContext = createContext<AuthContextType>();

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [pubkey, setPubkey] = useState<string | null>(null);

  const client = useMemo(() => {
    return new Client(TEST_HOMESERVER, {
      relay: TEST_PKARR_RELAY,
    });
  }, []);

  const isLoggedIn = useCallback(async (): Promise<string | boolean> => {
    try {
      await client.ready();
      const sessions = await client.session();
      const pks = Object.keys(sessions?.users);
      if (!pks.length) return false;
      setPubkey(pks[0]);
      return pks[0];
    } catch (error) {
      console.log(error);
    }
  }, [client]);

  const signUp = useCallback(async (): Promise<string> => {
    try {
      const pk = await isLoggedIn();
      if (!pk) {
        const seed = Client.crypto.generateSeed();
        const result = await client.signup(seed); // seed is zeroed
        if (!result.ok)
          throw new Error(`Signup failed: ${result.error.message}`);
        const newPubkey = result.value;
        setPubkey(newPubkey);

        // DEMO: generate recovery file content
        const encryptionKey = await _encryptionKeyFromPassphrase('password');
        const encryptedSeed = Client.crypto.encrypt(seed, encryptionKey);
        const recovery = z32.encode(encryptedSeed);
        console.log(`Recovery: ${recovery}`);

        return newPubkey;
      }
      return pk;
    } catch (error) {
      console.log(error);
    }
  }, [client, isLoggedIn]);

  const logout = useCallback(async () => {
    try {
      await client.ready();
      await client.logout(pubkey);
      const sessions = await client.session();
      Object.keys(sessions.users).map(async (pk) => {
        const result = await client.logout(pk);
        if (!result.ok)
          throw new Error(`Logout pubky:${pk} failed: ${result.error.message}`);
      });
      setPubkey(null);
    } catch (error) {
      console.log(error);
    }
  }, [client]);

  const saveProfile = useCallback(
    async (profile: any): Promise<void> => {
      try {
        const pk = await isLoggedIn();
        if (!pk) throw new Error('Logged in failed : not logged in.');
        const pubkeyProfile = _toPubkeyProfile(profile);
        const result = await client.social.profile.put(pk, pubkeyProfile);
        if (!result.ok)
          throw new Error(`Save profile:${pk} failed: ${result.error.message}`);
      } catch (error) {
        console.log(error);
      }
    },
    [client, isLoggedIn]
  );

  const getProfile = useCallback(async (): Promise<any> => {
    try {
      const pk = await isLoggedIn();
      if (!pk) throw new Error('Logged in failed : not logged in.');
      const result = await client.social.profile.get(pk);
      if (!result.ok)
        throw new Error(`Get profile:${pk} failed: ${result.error.message}`);
      return result.value;
    } catch (error) {
      console.log(error);
    }
  }, [client, isLoggedIn]);

  const getUser = useCallback(
    async (pk): Promise<any> => {
      try {
        if (!pk) throw new Error('Logged in failed : not logged in.');
        const result = await client.social.profile.get(pk);
        if (!result.ok)
          throw new Error(`Get profile:${pk} failed: ${result.error.message}`);
        return result.value;
      } catch (error) {
        console.log(error);
      }
    },
    [client, isLoggedIn]
  );

  const createPost = useCallback(
    async (content: string) => {
      try {
        const pk = await isLoggedIn();
        if (!pk) throw new Error('Get profile failed: not logged in.');
        const payload = {
          content: content,
        };
        const result = await client.social.posts.put(pk, { payload });
        if (!result.ok)
          throw new Error(`Put post:${pk} failed: ${result.error.message}`);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    [client, isLoggedIn]
  );

  const getPost = useCallback(
    async (uri: string) => {
      try {
        if (!uri) throw new Error('Get list posts failed');
        const result = await client.social.posts.get(uri);
        if (!result.ok)
          throw new Error(`Get post:${pk} failed: ${result.error.message}`);
        return result.value;
      } catch (error) {
        console.log(error);
      }
    },
    [client, isLoggedIn]
  );

  const listPosts = useCallback(
    async (pk: string) => {
      try {
        if (!pk) throw new Error('Get list posts failed');
        const result = await client.social.posts.list(pk, { limit: 5 });
        if (!result.ok)
          throw new Error(`Get posts:${pk} failed: ${result.error.message}`);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    [client, isLoggedIn]
  );

  return (
    <ClientContext.Provider
      value={{
        pubkey,
        isLoggedIn,
        createPost,
        getPost,
        listPosts,
        signUp,
        logout,
        saveProfile,
        getProfile,
        getUser,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  return useContext(ClientContext);
}

const _encryptionKeyFromPassphrase = async (password: string) => {
  return argon2id({
    password,
    salt: 'recovery',
    // Options are a copy of https://crates.io/crates/argon2 defaults
    iterations: 2,
    parallelism: 1,
    memorySize: 19 * 1024, // 19mb
    hashLength: 32,
    outputType: 'binary',
  });
};
const _toPubkeyProfile = (profile: any): any => {
  if (!profile) throw new Error('Profile is required');

  const pubkeyProfile: any = {
    name: profile.name || 'anonymous',
    bio: profile.info,
    image: profile.image,
    links: [
      { url: profile.links.website, title: 'website' },
      { url: profile.links.email, title: 'email' },
      { url: profile.links.x, title: 'x' },
      { url: profile.links.telegram, title: 'telegram' },
    ],
  };
  return pubkeyProfile;
};
