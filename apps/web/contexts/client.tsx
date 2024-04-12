/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import {
  IUserProfile,
  IProfilePubkyProps,
  ISignUpResponse,
  ISaveProfile,
  ITaggedPost,
  ICreatePostResponse,
  ICreateTagResponse,
  IFollowersResponse,
  IFollowingResponse,
  IMostFollowed,
  IPost,
  IFeed,
  TLayouts,
  TReach,
} from '../types';

export * from '@pubky/common';

import Client from '@pubky/sdk';
import localStorageUtils from '../libs/localStorageUtils';

const HOMESERVER = process.env.NEXT_PUBLIC_HOMESERVER || '';
const PKARR_RELAY = process.env.NEXT_PUBLIC_PKARR_RELAY || '';

type ClientContextType = {
  pubky: string | null;
  refreshList: boolean;
  signUp: (
    profile: IProfilePubkyProps,
    password: string
  ) => Promise<ISignUpResponse | null>;
  logout: () => Promise<boolean>;
  getProfile: () => Promise<IUserProfile | null>;
  saveProfile: (profile: IProfilePubkyProps) => Promise<ISaveProfile | null>;
  getUserIndexed: (userId: string) => Promise<IUserProfile | null>;
  createPost: (content: string) => Promise<ICreatePostResponse | null>;
  createTag: (uri: string, tag: string) => Promise<ICreateTagResponse | null>;
  getHotTags: () => Promise<ITaggedPost[] | null>;
  isLoggedIn: () => Promise<string | boolean>;
  listUserFeed: (
    pubky: string,
    cursor: string,
    limit?: number
  ) => Promise<IFeed | null>;
  listFollowers: (pk: string) => Promise<IFollowersResponse | null>;
  listFollowing: (pk: string) => Promise<IFollowingResponse | null>;
  getMostFollowed: () => Promise<IMostFollowed[] | null>;
  listGlobalPosts: (
    cursor: string,
    reach: TReach,
    tags?: string[]
  ) => Promise<IFeed | null>;
  getPost: (uri: string) => Promise<IPost | null>;
  getUser: (pk: string) => Promise<IUserProfile | null>;
  decryptRecoveryFile: (
    password: string,
    recoveryFile: Buffer
  ) => Promise<boolean>;
  setRefreshList: (value: boolean) => void;
  follow: (pk: string) => Promise<boolean>;
  unfollow: (pk: string) => Promise<boolean>;
};

const ClientContext = createContext<ClientContextType>({} as ClientContextType);

// Cache invalidation here seems a bit hacky and should be better
// done somewhere else, the relay? accept a storage to the client?
const homeserverUrlCache = localStorageUtils.get('homeserverUrl');
const homeserverUrl =
  homeserverUrlCache?.timestamp > Date.now() - 60 * 60 * 1000
    ? homeserverUrlCache.url
    : undefined;
console.log({ homeserverUrl });

// Calling the client as soon as possible, because... we want to find the server as soon as possible!
// and we aren't really switching homeserver according to the user settings any time soon.
const client = new Client(HOMESERVER, {
  relay: PKARR_RELAY,
  homeserverUrl,
});

client.ready().then(() => {
  localStorageUtils.set('homeserverUrl', {
    timestamp: Date.now(),
    url: client.homeserverUrl,
  });
});

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [pubky, setPubky] = useState<string | null>(
    (localStorageUtils.get('pubky') as TLayouts) || null
  );
  const [, setProfile] = useState<any>(
    localStorageUtils.get('profile') || null
  );
  const [refreshList, setRefreshList] = useState<boolean>(false);

  const isLoggedIn = useCallback(async (): Promise<string | false> => {
    try {
      if (pubky) return pubky;

      await client.ready();

      const sessions = await client.session();
      const pks = Object.keys(sessions?.users);

      if (!pks.length) {
        // remove any local storage data that might be there
        localStorageUtils.remove('pubky');
        localStorageUtils.remove('profile');
        setPubky(null);
        setProfile(null);

        return false;
      }

      localStorageUtils.set('pubky', pks[0]);
      setPubky(pks[0]);

      return pks[0];
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [client]);

  const signUp = useCallback(
    async (profile: any, password: string): Promise<ISignUpResponse | null> => {
      try {
        const seed = Client.crypto.generateSeed();

        const result = await client.signup(seed); // seed is zeroed

        if (!result.ok)
          throw new Error(`Signup failed: ${result.error.message}`);

        const pk = result.value as unknown as string;
        localStorageUtils.set('pubky', pk);
        setPubky(pk);

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
        return null;
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

      Object.keys(sessions.users).map(async (pk: string) => {
        await client.logout(pk);
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [client]);

  const saveProfile = useCallback(
    async (profile: IProfilePubkyProps): Promise<ISaveProfile | null> => {
      try {
        const pk = await isLoggedIn();

        if (!pk) throw new Error('Logged in failed : not logged in.');

        const pubkeyProfile = _toPubkeyProfile(profile);

        const result = await client.social.profile.put(pk, pubkeyProfile);

        setProfile(profile);
        localStorageUtils.set('profile', profile);

        if (!result.ok)
          throw new Error(`Save profile:${pk} failed: ${result.error.message}`);

        return result.value as ISaveProfile;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const getProfile = useCallback(async (): Promise<IUserProfile | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Logged in failed : not logged in.');

      await client.ready();

      const result = await client.social.profile.indexed(pk);

      if (!result.ok)
        throw new Error(`Get profile:${pk} failed: ${result.error.message}`);

      const profile = result.value?.profile;

      localStorageUtils.set('profile', profile);
      setProfile(profile);

      return result.value as IUserProfile;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [client]);

  const getUser = useCallback(
    async (pk: string): Promise<IUserProfile | null> => {
      try {
        if (!pk) throw new Error('Logged in failed : not logged in.');

        await client.ready();

        const result = await client.social.profile.indexed(pk);

        if (!result.ok)
          throw new Error(`Get profile:${pk} failed: ${result.error.message}`);

        return result.value as IUserProfile;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const getUserIndexed = useCallback(
    async (userId: string): Promise<IUserProfile | null> => {
      try {
        const pk = await isLoggedIn();

        if (!pk) throw new Error('Get profile indexed failed: not logged in.');
        if (!userId)
          throw new Error('Get profile indexed failed: no viewer id pubky');

        await client.ready();

        const result = await client.social.profile.indexed(userId, pk);

        if (!result.ok)
          throw new Error(
            `Get profile indexed:${pk} failed: ${result.error.message}`
          );

        return result.value as IUserProfile;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const createPost = useCallback(
    async (content: string): Promise<ICreatePostResponse | null> => {
      try {
        const pk = await isLoggedIn();

        if (!pk) throw new Error('Get profile failed: not logged in.');

        await client.ready();

        const result = await client.social.posts.put(pk, {
          content: content,
        });

        if (!result.ok)
          throw new Error(`Put post:${pk} failed: ${result.error.message}`);

        return result.value as ICreatePostResponse;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const createTag = useCallback(
    async (uri: string, tag: string): Promise<ICreateTagResponse | null> => {
      try {
        const pk = await isLoggedIn();

        if (!pk) throw new Error('Get create Tag: not logged in.');
        if (!uri) throw new Error('Get create Tag: no uri.');
        if (!tag) throw new Error('Get create Tag: no tag name.');

        await client.ready();

        const result = await client.social.tags.put(pk, uri, tag);

        if (!result.ok)
          throw new Error(`Put tag:${pk} failed: ${result.error.message}`);

        return result.value as ICreateTagResponse;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const getHotTags = useCallback(async (): Promise<ITaggedPost[] | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get Hot Tag: not logged in.');

      await client.ready();

      const result = await client.social.tags.hotTags();

      if (!result.ok)
        throw new Error(`GET hot tags:${pk} failed: ${result.error.message}`);

      return result.value as ITaggedPost[];
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [client]);

  const getPost = useCallback(
    async (uri: string): Promise<IPost | null> => {
      try {
        if (!uri) throw new Error('Get list posts failed');

        await client.ready();

        const result = await client.social.posts.get(uri);

        if (!result.ok)
          throw new Error(`Get post failed: ${result.error.message}`);

        return result.value as unknown as IPost;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const follow = useCallback(
    async (pk: string) => {
      try {
        if (!pk) throw new Error('Pubky required');

        const pkLogged = await isLoggedIn();

        if (!pkLogged) throw new Error('Not logged in.');

        await client.ready();

        const result = await client.social.graph.follow(pkLogged, pk);

        if (!result.ok)
          throw new Error(`Post follow:${pk} failed: ${result.error.message}`);

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    [client]
  );

  const unfollow = useCallback(
    async (pk: string) => {
      try {
        if (!pk) throw new Error('Pubky required');

        const pkLogged = await isLoggedIn();

        if (!pkLogged) throw new Error('Not logged in.');

        await client.ready();

        const result = await client.social.graph.unfollow(pkLogged, pk);

        if (!result.ok)
          throw new Error(`Unfollow:${pk} failed: ${result.error.message}`);

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    [client]
  );

  const listFollowing = useCallback(
    async (pk: string): Promise<IFollowingResponse | null> => {
      try {
        if (!pk) throw new Error('Get list followers failed');

        await client.ready();

        const result = await client.social.graph.following(pk);

        if (!result.ok)
          throw new Error(
            `Get list followers:${pk} failed: ${result.error.message}`
          );

        return result.value as IFollowingResponse;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const getMostFollowed = useCallback(async (): Promise<
    IMostFollowed[] | null
  > => {
    try {
      await client.ready();

      const result = await client.social.graph.mostFollowed();

      if (!result.ok)
        throw new Error(`Get most followed failed: ${result.error.message}`);

      return result.value as IMostFollowed[];
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [client]);

  const listFollowers = useCallback(
    async (pk: string): Promise<IFollowersResponse | null> => {
      try {
        if (!pk) throw new Error('Get list followers failed');

        await client.ready();

        const result = await client.social.graph.followers(pk);

        if (!result.ok)
          throw new Error(
            `Get list followers:${pk} failed: ${result.error.message}`
          );
        return result.value as IFollowersResponse;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const listUserFeed = useCallback(
    async (pk: string, cursor: string, limit = 5): Promise<IFeed | null> => {
      try {
        if (!pk) throw new Error('Get list posts failed');

        await client.ready();

        const result = await client.social.streams.userFeed(pk, {
          limit: limit,
          cursor: cursor,
        });

        if (!result.ok)
          throw new Error(`Get posts:${pk} failed: ${result.error.message}`);

        return result.value as unknown as IFeed;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    [client]
  );

  const listGlobalPosts = useCallback(
    async (
      cursor: string,
      reach: 'following' | 'all' | 'followers' | 'friends',
      tags?: string[]
    ): Promise<IFeed | null> => {
      try {
        // TODO: find a way to memoize the client across page refresh
        // that will basically require extracting the internal caches,
        // and load it in subsequent client instances.

        const pk = await isLoggedIn();

        if (!pk) throw new Error('Get global posts failed: not logged in.');

        await client.ready();

        const result = await client.social.streams.get(pk, {
          limit: 6,
          cursor: cursor,
          reach: reach ? reach : 'all',
          tags: tags,
        });

        if (!result.ok)
          throw new Error(
            `Get global posts: ${cursor} failed: ${result.error.message}`
          );

        return result.value as unknown as IFeed;
      } catch (error) {
        console.log(error);
        return null;
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
        createTag,
        getHotTags,
        getPost,
        listUserFeed,
        signUp,
        logout,
        saveProfile,
        getUserIndexed,
        getProfile,
        getUser,
        decryptRecoveryFile,
        listGlobalPosts,
        listFollowers,
        listFollowing,
        getMostFollowed,
        setRefreshList,
        follow,
        unfollow,
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
    bio: profile?.bio || '',
    image: profile.image,
    links: [
      { url: profile?.links?.website || '', title: 'website' },
      { url: profile?.links?.email || '', title: 'email' },
      { url: profile?.links?.x || '', title: 'x' },
      { url: profile?.links?.telegram || '', title: 'telegram' },
    ],
  };
  return pubkeyProfile;
};
