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
import Client from '@pubky/sdk';
export * from '@pubky/common';
import z32 from 'z32';

import { argon2id } from 'hash-wasm';

const TEST_HOMESERVER =
  'pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo';
const TEST_PKARR_RELAY = 'http://localhost:7258';

type AuthContextType = {
  signUp: () => Promise<any>;
  logout: () => Promise<void>;
  getProfile: () => Promise<any>;
  saveProfile: (profile: any) => Promise<void>;
  createPost: (post: any) => Promise<any>;
  isLoggedIn: () => Promise<boolean>;
  profile: any;
  pubkey: string;
};

const ClientContext = createContext<AuthContextType>();

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [pubkey, setPubkey] = useState();

  const client = useMemo(() => {
    return new Client(TEST_HOMESERVER, {
      relay: TEST_PKARR_RELAY,
    });
  }, []);

  const isLoggedIn = useCallback(async (): Promise<boolean> => {
    await client.ready();
    const sessions = await client.session();
    const pks = Object.keys(sessions?.users);
    if (!pks.length) return false;
    setPubkey(pks[0]);
    return true;
  }, [client]);

  const signUp = useCallback(async (): Promise<string> => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      const seed = Client.crypto.generateSeed();
      const result = await client.signup(seed); // seed is zeroed
      if (!result.ok) throw new Error(`Signup failed: ${result.error.message}`);
      const newPubkey = result.value;
      setPubkey(newPubkey);
      console.log(`Signup success: ${newPubkey}`);

      // DEMO: generate recovery file content
      const encryptionKey = await _encryptionKeyFromPassphrase('password');
      const encryptedSeed = Client.crypto.encrypt(seed, encryptionKey);
      const recovery = z32.encode(encryptedSeed);
      console.log(`Recovery: ${recovery}`);

      return newPubkey;
    }
    return pubkey;
  }, [client, pubkey, isLoggedIn]);

  const logout = useCallback(async () => {
    await client.ready();
    const sessions = await client.session();
    Object.keys(sessions.users).map(async (pk) => {
      const result = await client.logout(pk);
      if (!result.ok)
        throw new Error(`Logout pubky:${pk} failed: ${result.error.message}`);
    });
  }, [client]);

  const saveProfile = useCallback(
    async (profile: any): Promise<void> => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) throw new Error('Logged in failed : not logged in.');
      const pubkeyProfile = _toPubkeyProfile(profile);
      const result = await client.social.profile.put(pubkey, pubkeyProfile);
      if (!result.ok)
        throw new Error(
          `Save pubkey:${pubkey} profile failed: ${result.error.message}`
        );
      console.log(
        `Saved pubkey:${pubkey} profile: ${JSON.stringify(
          pubkeyProfile,
          null,
          2
        )}`
      );
    },
    [client, pubkey, isLoggedIn]
  );

  const getProfile = useCallback(async (): Promise<any> => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) throw new Error('Logged in failed : not logged in.');
    const result = await client.social.profile.get(pubkey);
    if (!result.ok)
      throw new Error(
        `Get pubkey:${pubkey} profile failed: ${result.error.message}`
      );
    const pubkeyProfile = result.value;
    console.log(
      `Got pubkey:${pubkey} profile: ${JSON.stringify(pubkeyProfile, null, 2)}`
    );
    return pubkeyProfile;
  }, [client, pubkey, isLoggedIn]);

  const createPost = useCallback(
    async (post): Promise<any> => {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) throw new Error('Logged in failed : not logged in.');
      const result = await client.social.post.put(pubkey, post);
      if (!result.ok)
        throw new Error(
          `CREATE post:${pubkey} profile failed: ${result.error.message}`
        );
      const postInfo = result.value;
      console.log(
        `Got pubkey:${pubkey} profile: ${JSON.stringify(postInfo, null, 2)}`
      );
      return postInfo;
    },
    [client, pubkey, isLoggedIn]
  );

  return (
    <ClientContext.Provider
      value={{
        pubkey,
        isLoggedIn,
        createPost,
        signUp,
        logout,
        saveProfile,
        getProfile,
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
