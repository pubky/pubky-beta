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
  downloadRecoveryFile: (
    filename: string
  ) => Promise<{ recoveryFile: Buffer; filename: string }>;
  decryptRecoveryFile: (
    password: string,
    recoveryFile: Buffer
  ) => Promise<Uint8Array>;
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

        setPubkey(result.value);

        return result.value;
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

  const downloadRecoveryFile = useCallback(
    async (password: string) => {
      try {
        const seed = Client.crypto.generateSeed();

        const { recoveryFile, filename } =
          await client.seedRecovery.recoveryFile(
            'recovery_file',
            seed,
            password
          );
        return { recoveryFile, filename };
      } catch (error) {
        console.log(error);
      }
    },
    [client]
  );

  const decryptRecoveryFile = useCallback(
    async (password: string, recoveryFile: Buffer) => {
      try {
        const recoveredSeed = await client.seedRecovery.decryptRecoveryFile(
          recoveryFile,
          password
        );

        if (recoveredSeed.isErr()) {
          console.log(recoveredSeed.error);
          return false;
        }
        await client.signup(recoveredSeed.value);

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    [client]
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
        downloadRecoveryFile,
        decryptRecoveryFile,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClientContext() {
  return useContext(ClientContext);
}

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
