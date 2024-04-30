/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

'use client';

import { createContext, useContext, useState } from 'react';
import {
  IUserProfile,
  IProfilePubkyProps,
  ISignUpResponse,
  ISaveProfile,
  ITaggedPost,
  ICreatePostResponse,
  ICreateTagResponse,
  IDeleteTagResponse,
  IFollowersResponse,
  IFollowingResponse,
  IMostFollowed,
  IRecommendedProfiles,
  IPost,
  IFeed,
  TLayouts,
  ClientContextType,
  IProfile,
  IDeletePost,
  INewPost,
} from '../types';

export * from '@pubky/common';

import Client from '@pubky/sdk';
import localStorageUtils from '../libs/localStorageUtils';

const HOMESERVER = process.env.NEXT_PUBLIC_HOMESERVER || '';
const PKARR_RELAY = process.env.NEXT_PUBLIC_PKARR_RELAY || '';

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

const startClient = async () => {
  await client.ready();

  localStorageUtils.set('homeserverUrl', {
    timestamp: Date.now(),
    url: client.homeserverUrl,
  });
};
startClient();

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [pubky, setPubky] = useState<string | null>(
    (localStorageUtils.get('pubky') as TLayouts) || null
  );
  const [hotTags, setHotTags] = useState<ITaggedPost[] | null>(null);
  const [mostFollowed, setMostFollowed] = useState<IMostFollowed[] | null>(
    null
  );
  const [recommendedProfiles, setRecommendedProfiles] = useState<
    IRecommendedProfiles[] | null
  >(null);
  const [profile, setProfile] = useState<string | null>(
    localStorageUtils.get('profile') || null
  );
  const [posts, setPosts] = useState<INewPost>({} as INewPost);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [refreshList, setRefreshList] = useState<boolean>(false);

  const isLoggedIn = async (): Promise<string | false> => {
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
  };

  const signUp = async (
    userProfile: IProfilePubkyProps,
    password: string
  ): Promise<ISignUpResponse | false> => {
    try {
      const seed = Client.crypto.generateSeed();

      await client.ready();

      const result = await client.signup(seed); // seed is zeroed

      if (!result.ok) throw new Error(`Signup failed: ${result.error.message}`);

      const pk = result.value as unknown as string;
      localStorageUtils.set('pubky', pk);
      setPubky(pk);

      const pubkeyProfile = _toPubkeyProfile(userProfile);

      await client.social.profile.put(pk, pubkeyProfile);

      setProfile(pubkeyProfile);
      localStorageUtils.set('profile', pubkeyProfile);

      return await client.seedRecovery.recoveryFile(
        'recovery_file',
        seed,
        password
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
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
  };

  const saveProfile = async (
    userProfile: IProfilePubkyProps
  ): Promise<ISaveProfile | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Logged in failed : not logged in.');

      const pubkeyProfile = _toPubkeyProfile(userProfile);

      await client.ready();

      const result = await client.social.profile.put(pk, pubkeyProfile);

      setProfile(pubkeyProfile);
      localStorageUtils.set('profile', pubkeyProfile);

      if (!result.ok)
        throw new Error(`Save profile:${pk} failed: ${result.error.message}`);

      return result.value as ISaveProfile;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getProfile = async (): Promise<IProfile | null> => {
    try {
      const pk = await isLoggedIn();
      if (!pk) throw new Error('Logged in failed : not logged in.');

      if (profile) return profile;

      await client.ready();

      const result = await client.social.profile.indexed(pk);

      if (!result.ok)
        throw new Error(`Get profile:${pk} failed: ${result.error.message}`);

      const userProfile = result.value?.profile;

      localStorageUtils.set('profile', userProfile);
      setProfile(userProfile);

      return userProfile;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getUser = async (pk: string): Promise<IUserProfile | null> => {
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
  };

  const getUserIndexed = async (
    userId: string
  ): Promise<IUserProfile | null> => {
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
  };

  const createPost = async (content: string): Promise<IPost | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');

      await client.ready();

      const result = await client.social.posts.put(pk, {
        content: content,
      });

      if (!result.ok)
        throw new Error(`Put post:${pk} failed: ${result.error.message}`);

      const postResult = await client.social.posts.get(result.value.uri);

      if (!postResult.ok)
        throw new Error(`Put post:${pk} failed: ${postResult.error.message}`);

      return postResult.value as ICreatePostResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const createTag = async (
    uri: string,
    tag: string
  ): Promise<ICreateTagResponse | null> => {
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
  };

  const deleteTag = async (
    uri: string,
    tag: string
  ): Promise<IDeleteTagResponse | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get delete Tag: not logged in.');
      if (!uri) throw new Error('Get delete Tag: no uri.');
      if (!tag) throw new Error('Get delete Tag: no tag name.');

      await client.ready();

      const result = await client.social.tags.delete(pk, uri, tag);

      if (!result.ok)
        throw new Error(`Delete tag:${pk} failed: ${result.error.message}`);

      return result.value as IDeleteTagResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getHotTags = async (): Promise<ITaggedPost[] | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get Hot Tag: not logged in.');

      if (hotTags) return hotTags;

      await client.ready();

      const result = await client.social.tags.hotTags();

      if (!result.ok)
        throw new Error(`GET hot tags:${pk} failed: ${result.error.message}`);

      setHotTags(result.value);

      return result.value as ITaggedPost[];
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getPost = async (uri: string): Promise<IPost | null> => {
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
  };

  const follow = async (pk: string) => {
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
  };

  const unfollow = async (pk: string) => {
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
  };

  const listFollowing = async (
    pk: string
  ): Promise<IFollowingResponse | null> => {
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
  };

  const getMostFollowed = async (): Promise<IMostFollowed[] | null> => {
    try {
      if (mostFollowed) return mostFollowed;

      await client.ready();

      const result = await client.social.graph.mostFollowed();

      if (!result.ok)
        throw new Error(`Get most followed failed: ${result.error.message}`);

      setMostFollowed(result.value);

      return result.value as IMostFollowed[];
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const deletePost = async (postId: string): Promise<IDeletePost | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get delete Post: not logged in.');
      if (!postId) throw new Error('Get delete Post: no postId name.');

      await client.ready();

      const result = await client.social.posts.delete(pk, postId);

      if (!result.ok)
        throw new Error(`Delete post:${pk} failed: ${result.error.message}`);

      return result.value as IDeletePost;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getRecommendedProfiles = async (
    pk: string
  ): Promise<IRecommendedProfiles[] | null> => {
    try {
      if (!pk) throw new Error('Get recommended profiles failed');
      if (recommendedProfiles) return recommendedProfiles;

      await client.ready();

      const result = await client.social.graph.recommendedProfiles(pk);

      if (!result.ok)
        throw new Error(
          `Get recommended profiles failed: ${result.error.message}`
        );

      setRecommendedProfiles(result.value);

      return result.value as IRecommendedProfiles[];
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const listFollowers = async (
    pk: string
  ): Promise<IFollowersResponse | null> => {
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
  };

  const listUserFeed = async (
    pk: string,
    cursor: string,
    limit = 5
  ): Promise<IFeed | null> => {
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
  };

  const listGlobalPosts = async (
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
  };

  const decryptRecoveryFile = async (
    password: string,
    recoveryFile: Buffer
  ) => {
    try {
      await client.ready();

      const recoveredSeed = await client.seedRecovery.decryptRecoveryFile(
        recoveryFile,
        password
      );

      if (recoveredSeed.isErr()) {
        console.log(recoveredSeed.error);
        return false;
      }
      const result = await client.login(recoveredSeed.value);

      if (!result.ok)
        throw new Error(`Sign up failed: ${result.error.message}`);

      localStorageUtils.set('pubky', result.value);
      setPubky(result.value);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <ClientContext.Provider
      value={{
        hotTags,
        mostFollowed,
        pubky,
        profile,
        refreshList,
        posts,
        isLoggedIn,
        createPost,
        createTag,
        deleteTag,
        deletePost,
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
        getRecommendedProfiles,
        searchTags,
        setPosts,
        setRefreshList,
        setSearchTags,
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

const _toPubkeyProfile = (profile: IUserProfile): IProfile => {
  if (!profile) throw new Error('Profile is required');

  return {
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
};
