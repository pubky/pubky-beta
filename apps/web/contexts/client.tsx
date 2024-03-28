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
import localStorageUtils from '../libs/localStorageUtils';

const TEST_HOMESERVER =
  'pk:z6damwc3jzj1jmtac3kmsiyrgdfxaw8awndaedfnns3obyg9tzxo';
const TEST_PKARR_RELAY = 'http://localhost:7258';

type ClientContextType = {
  pubky: string | null;
  refreshList: boolean;
  signUp: (
    profile: any,
    password: string
  ) => Promise<{ recoveryFile: Buffer; filename: string }>;
  logout: () => Promise<void>;
  getProfile: (cache?: boolean) => Promise<any>;
  saveProfile: (profile: any) => Promise<void>;
  createPost: (post: any) => Promise<any>;
  isLoggedIn: () => Promise<boolean>;
  listPosts: (pubky: string, cursor: string) => Promise<any>;
  listUserFeed: (pubky: string, cursor: string) => Promise<any>;
  listFollowers: (pubky: string) => Promise<any>;
  listGlobalPosts: (
    cursor: string,
    reach: 'following' | 'all' | 'followers' | 'friends'
  ) => Promise<any>;
  getPost: (uri: string) => Promise<any>;
  getUser: (pk: string) => Promise<any>;
  decryptRecoveryFile: (
    password: string,
    recoveryFile: Buffer
  ) => Promise<Uint8Array>;
  setRefreshList: (value: boolean) => void;
};

const ClientContext = createContext<ClientContextType>();

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [pubky, setPubky] = useState<string | null>(
    (localStorageUtils.get('pubky') as Layout) || null
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profile, setProfile] = useState<any>(
    localStorageUtils.get('profile') || null
  );
  const [refreshList, setRefreshList] = useState<boolean>(false);

  const client = useMemo(() => {
    return new Client(TEST_HOMESERVER, {
      relay: TEST_PKARR_RELAY,
    });
  }, [pubky]);

  const isLoggedIn = useCallback(async (): Promise<string | boolean> => {
    try {
      await client.ready();

      if (pubky) return pubky;

      const sessions = await client.session();

      const pks = Object.keys(sessions?.users);

      if (!pks.length) return false;

      localStorageUtils.set('pubky', pks[0]);
      setPubky(pks[0]);

      return pks[0];
    } catch (error) {
      console.log(error);
    }
  }, [client]);

  const signUp = useCallback(
    async (profile: any, password: string): Promise<string> => {
      try {
        const seed = Client.crypto.generateSeed();

        const result = await client.signup(seed); // seed is zeroed

        if (!result.ok)
          throw new Error(`Signup failed: ${result.error.message}`);

        localStorageUtils.set('pubky', result.value);
        setPubky(result.value);

        await saveProfile(profile);

        const { recoveryFile, filename } =
          await client.seedRecovery.recoveryFile(
            'recovery_file',
            seed,
            password
          );

        return { recoveryFile, filename };
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    [client, isLoggedIn]
  );

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      localStorageUtils.remove('pubky');
      localStorageUtils.remove('profile');
      setPubky(null);
      setProfile(null);

      await client.ready();

      const sessions = await client.session();

      Object.keys(sessions.users).map(async (pk) => {
        await client.logout(pk);
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [client]);

  const saveProfile = useCallback(
    async (profile: any): Promise<void> => {
      try {
        const pk = await isLoggedIn();

        if (!pk) throw new Error('Logged in failed : not logged in.');

        const pubkeyProfile = _toPubkeyProfile(profile);

        const result = await client.social.profile.put(pk, pubkeyProfile);

        setProfile(profile);
        localStorageUtils.set('profile', profile);

        if (!result.ok)
          throw new Error(`Save profile:${pk} failed: ${result.error.message}`);
      } catch (error) {
        console.log(error);
      }
    },
    [client]
  );

  const getProfile = useCallback(
    async (cache = false): Promise<any> => {
      try {
        if (cache) {
          if (profile) return profile;
        }
        console.log(profile);

        const pk = await isLoggedIn();

        if (!pk) throw new Error('Logged in failed : not logged in.');

        const result = await client.social.profile.get(pk);

        if (!result.ok)
          throw new Error(`Get profile:${pk} failed: ${result.error.message}`);

        localStorageUtils.set('profile', result.value);
        setProfile(result.value);

        return result.value;
      } catch (error) {
        console.log(error);
      }
    },
    [client]
  );

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
    [client]
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
    [client]
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
    [client]
  );

  const listFollowers = useCallback(
    async (pk: string) => {
      try {
        if (!pk) throw new Error('Get list followers failed');
        await client.ready();

        const result = await client.social.graph.followers(pk);

        if (!result.ok)
          throw new Error(
            `Get list followers:${pk} failed: ${result.error.message}`
          );

        return result.value;
      } catch (error) {
        console.log(error);
      }
    },
    [client]
  );

  const listUserFeed = useCallback(
    async (pk: string, cursor: string) => {
      try {
        if (!pk) throw new Error('Get list posts failed');

        await client.ready();

        const result = await client.social.posts.list(pk, {
          limit: 5,
          cursor: cursor,
        });

        if (!result.ok)
          throw new Error(`Get posts:${pk} failed: ${result.error.message}`);

        return result.value;
      } catch (error) {
        console.log(error);
      }
    },
    [client]
  );

  const listPosts = useCallback(
    async (pk: string, cursor: string) => {
      try {
        if (!pk) throw new Error('Get list posts failed');

        const result = await client.social.posts.list(pk, {
          limit: 5,
          cursor: cursor,
        });

        if (!result.ok)
          throw new Error(`Get posts:${pk} failed: ${result.error.message}`);

        return result.value;
      } catch (error) {
        console.log(error);
      }
    },
    [client]
  );

  const listGlobalPosts = useCallback(
    async (
      cursor: string,
      reach: 'following' | 'all' | 'followers' | 'friends'
    ) => {
      try {
        // TODO: find a way to memoize the client across page referesh
        // that will basically require exctracting the internal caches,
        // and load it in subsequent client instances.

        const pk = await isLoggedIn();

        if (!pk) throw new Error('Get global posts failed: not logged in.');

        const result = await client.social.streams.all(pk, {
          limit: 5,
          cursor: cursor,
          reach: reach ? reach : 'all',
        });

        if (!result.ok)
          throw new Error(
            `Get global posts:${cursor} failed: ${result.error.message}`
          );

        return result.value;
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
        pubky,
        refreshList,
        isLoggedIn,
        createPost,
        getPost,
        listPosts,
        listUserFeed,
        signUp,
        logout,
        saveProfile,
        getProfile,
        getUser,
        decryptRecoveryFile,
        listGlobalPosts,
        listFollowers,
        setRefreshList,
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
    bio: profile.bio,
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
