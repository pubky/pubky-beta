/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  ICreateReplyResponse,
  ICreateTagResponse,
  IDeleteTagResponse,
  IFollowersResponse,
  IFollowingResponse,
  IMostFollowed,
  IRecommendedProfiles,
  IPost,
  IFeed,
  TClientContext,
  IProfile,
  IDeletePost,
  INewPost,
  ICreateRepostResponse,
  IBookmark,
  IRecoveryFileResponse,
  IFileContent,
} from '../types';

import Client from '@pubky/sdk';
import { Utils } from '@social/utils-shared';

const HOMESERVER = process.env.NEXT_PUBLIC_HOMESERVER || '';
const PKARR_RELAY = process.env.NEXT_PUBLIC_PKARR_RELAY || '';

const ClientContext = createContext<TClientContext>({} as TClientContext);

const homeserverUrlCache = Utils.storage.get('homeserverUrl');
const homeserverUrl =
  homeserverUrlCache?.timestamp > Date.now() - 60 * 60 * 1000
    ? homeserverUrlCache.url
    : undefined;
console.log({ homeserverUrl });

const client = new Client(HOMESERVER, {
  relay: PKARR_RELAY,
  homeserverUrl,
});

const startClient = async () => {
  await client.ready();

  Utils.storage.set('homeserverUrl', {
    timestamp: Date.now(),
    url: client.homeserverUrl,
  });
};
startClient();

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [pubky, setPubky] = useState<string | null>(
    (Utils.storage.get('pubky') as string) || null
  );
  const [seed, setSeed] = useState<string | null>(
    Utils.storage.get('seed') || null
  );
  const [hotTags, setHotTags] = useState<ITaggedPost[] | null>(null);
  const [mostFollowed, setMostFollowed] = useState<IMostFollowed[] | null>(
    null
  );
  const [recommendedProfiles, setRecommendedProfiles] = useState<
    IRecommendedProfiles[] | null
  >(null);
  const [profile, setProfile] = useState<string | null>(
    Utils.storage.get('profile') || null
  );
  const [posts, setPosts] = useState<INewPost>({} as INewPost);
  const [searchTags, setSearchTags] = useState<string[]>([]);

  {
    /** const deleteFile = async (fileId: string) => {
    try {
      if (!pubky) throw new Error('Pubky required');

      await client.ready();

      const result = await client.social.files.delete(pubky, fileId);

      if (!result.ok) throw new Error(`Delete failed: ${result.error.message}`);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  */
  }

  const updateStatus = async (value: TStatus | string) => {
    try {
      if (!pubky) throw new Error('Pubky required');
      if (!profile) throw new Error('Profile required');

      await client.ready();

      const updatedProfile = {
        ...profile,
        status: value,
      };

      Utils.storage.set('profile', updatedProfile);

      const result = await client.social.profile.put(pubky, updatedProfile);

      if (!result.ok)
        throw new Error(
          `Update status:${pubky} failed: ${result.error.message}`
        );
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = async (): Promise<string | false> => {
    try {
      if (pubky) return pubky;

      await client.ready();

      const sessions = await client.session();
      const pks = Object.keys(sessions?.users);

      if (!pks.length) {
        // remove any local storage data that might be there
        Utils.storage.remove('pubky');
        Utils.storage.remove('profile');
        setPubky(null);
        setProfile(null);

        return false;
      }

      if (pks[0]) {
        const profile = await getUser(pks[0]);
        if (profile.profile) {
          Utils.storage.set('pubky', pks[0]);
          setPubky(pks[0]);
        } else {
          await client.logout(pks[0]);
          return undefined;
        }
      }

      return pks[0];
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const session = async (): Promise<string | false> => {
    try {
      await client.ready();
      const sessions = await client.session();
      return sessions;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const signUp = async (
    userProfile: IProfilePubkyProps
  ): Promise<ISignUpResponse | false> => {
    try {
      const generatedSeed = Client.crypto.generateSeed();
      const seed = Utils.uint8ArrayToBase64(generatedSeed);
      Utils.storage.set('seed', seed);
      setSeed(seed);
      await client.ready();

      const result = await client.signup(generatedSeed); // seed is zeroed

      if (!result.ok) throw new Error(`Signup failed: ${result.error.message}`);

      const pk = result.value as unknown as string;
      Utils.storage.set('pubky', pk);
      setPubky(pk);

      const pubkeyProfile = _toPubkeyProfile(userProfile);

      await client.social.profile.put(pk, pubkeyProfile);

      setProfile(pubkeyProfile);
      Utils.storage.set('profile', pubkeyProfile);

      return pubkeyProfile;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getRecoveryFile = async (
    password: string
  ): Promise<IRecoveryFileResponse | null> => {
    try {
      await client.ready();

      const base64Seed = Utils.storage.get('seed');
      const uint8ArraySeed = Utils.base64ToUint8Array(base64Seed);

      return await client.seedRecovery.recoveryFile(
        'pubky_recovery',
        uint8ArraySeed,
        password
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      Utils.storage.remove('pubky');
      Utils.storage.remove('profile');
      Utils.storage.remove('seed');
      Utils.storage.remove('backup');
      Utils.storage.remove('timerRemind');
      Utils.storage.remove('checkLink');
      Utils.storage.remove('notificationPreferences');
      setPubky(null);
      setProfile(null);
      setSeed(null);

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
      Utils.storage.set('profile', pubkeyProfile);

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
      if (pk === undefined) return undefined;
      else if (!pk) throw new Error('Logged in failed : not logged in.');

      if (profile) return profile;

      await client.ready();

      const result = await client.social.profile.indexed(pk);

      if (!result.ok)
        throw new Error(`Get profile:${pk} failed: ${result.error.message}`);

      const userProfile = result.value?.profile;

      Utils.storage.set('profile', userProfile);
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

  const createPost = async (
    content: string,
    file?: File
  ): Promise<IPost | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');

      await client.ready();

      let fileUri: string | undefined;

      if (file) {
        const fileContent = await file.arrayBuffer();
        const fileUploadResult = await client.social.files.upload(pk, {
          content: Buffer.from(fileContent),
          contentType: file.type,
          size: file.size,
        });

        if (!fileUploadResult.ok) {
          throw new Error(
            `File upload failed: ${fileUploadResult.error.message}`
          );
        }
        fileUri = fileUploadResult.value.uri;
      }

      const postPayload = {
        content,
      };

      if (fileUri) {
        postPayload.fileUri = fileUri;
      }

      const result = await client.social.posts.put(pk, postPayload);
      const newPosts = JSON.parse(JSON.stringify(posts));
      if (newPosts && result.value.id) {
        newPosts[result.value.id] = result.value;

        const updatedPosts = {
          [result.value.id]: result.value,
          ...newPosts,
        };
        setPosts(updatedPosts);
      }

      if (!result.ok) {
        throw new Error(`Put post:${pk} failed: ${result.error.message}`);
      }

      const postResult = await client.social.posts.get(result.value.uri);

      if (!postResult.ok)
        throw new Error(`Put post:${pk} failed: ${postResult.error.message}`);

      return postResult.value as ICreatePostResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const createRepost = async (
    uri: string,
    content?: string,
    file?: File
  ): Promise<IPost | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');

      await client.ready();

      let fileUri: string | undefined;

      if (file) {
        const fileContent = await file.arrayBuffer();
        const fileUploadResult = await client.social.files.upload(pk, {
          content: Buffer.from(fileContent),
          contentType: file.type,
          size: file.size,
        });

        if (!fileUploadResult.ok) {
          throw new Error(
            `File upload failed: ${fileUploadResult.error.message}`
          );
        }
        fileUri = fileUploadResult.value.uri;
      }

      const repostPayload = {
        content: content && content,
        embed: {
          type: 'post',
          uri: uri,
        },
      };

      if (fileUri) {
        repostPayload.fileUri = fileUri;
      }

      const result = await client.social.posts.put(pk, repostPayload);

      if (!result.ok) {
        throw new Error(`Put repost:${pk} failed: ${result.error.message}`);
      }

      const repostResult = await client.social.posts.get(result.value.uri);
      const newPosts = JSON.parse(JSON.stringify(posts));
      if (newPosts && postResult.value.id) {
        newPosts[postResult.value.id] = postResult.value;

        const updatedPosts = {
          [postResult.value.id]: postResult.value,
          ...newPosts,
        };
        setPosts(updatedPosts);
      }

      if (!repostResult.ok)
        throw new Error(`Get repost:${pk} failed: ${postResult.error.message}`);

      return result.value as ICreateRepostResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const createReply = async (
    content: string,
    uriPost: string,
    rootUri: string,
    file?: File
  ): Promise<IReply | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');

      await client.ready();

      let fileUri: string | undefined;

      if (file) {
        const fileContent = await file.arrayBuffer();
        const fileUploadResult = await client.social.files.upload(pk, {
          content: Buffer.from(fileContent),
          contentType: file.type,
          size: file.size,
        });

        if (!fileUploadResult.ok) {
          throw new Error(
            `File upload failed: ${fileUploadResult.error.message}`
          );
        }
        fileUri = fileUploadResult.value.uri;
      }

      const replyPayload = {
        content,
        parent: uriPost,
        root: rootUri,
      };

      if (fileUri) {
        replyPayload.fileUri = fileUri;
      }

      const result = await client.social.posts.put(pk, replyPayload);

      if (!result.ok)
        throw new Error(`Put reply:${pk} failed: ${result.error.message}`);

      return result.value as ICreateReplyResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getFile = async (uri: string) => {
    try {
      await client.ready();

      const result = await client.social.files.get(uri);

      if (!result.ok)
        throw new Error(`Get file failed: ${result.error.message}`);

      return result.value as IFileContent;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getReplies = async (uri: string): Promise<IReply | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');

      await client.ready();

      const repliesResult = await client.social.posts.thread(uri, {
        viewerId: pk,
      });

      if (!repliesResult.ok)
        throw new Error(
          `Put reply:${pk} failed: ${repliesResult.error.message}`
        );

      return repliesResult.value as ICreateReplyResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const createBookmark = async (
    id: string,
    uri: string
  ): Promise<IBookmark | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');

      await client.ready();

      const result = await client.social.bookmarks.put(pk, uri);

      if (!result.ok) {
        throw new Error(`Put bookmark:${pk} failed: ${result.error.message}`);
      }

      const newPosts = JSON.parse(JSON.stringify(posts));

      if (newPosts && newPosts[id]) {
        newPosts[id].bookmark = { id: uri };
        setPosts(newPosts);
      } else {
        const newPost = await client.social.posts.get(uri);
        newPost.bookmark = { id: uri };
        setPosts(newPost);
      }

      return result.value as IBookmark;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const deleteBookmark = async (
    id: string,
    uri: string,
    bookmarkId: string
  ): Promise<IBookmark | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');

      await client.ready();

      const result = await client.social.bookmarks.delete(pk, uri, bookmarkId);

      if (!result.ok) {
        throw new Error(
          `Delete bookmark:${pk} failed: ${result.error.message}`
        );
      }

      const newPosts = JSON.parse(JSON.stringify(posts));
      delete newPosts[id].bookmark.id;
      setPosts(newPosts);

      return result.value as IBookmark;
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

      if (!result.ok) {
        throw new Error(`Put tag:${pk} failed: ${result.error.message}`);
      }

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

      if (!result.ok) {
        throw new Error(`Delete tag:${pk} failed: ${result.error.message}`);
      }

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

  const getNotifications = async () => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get Notifications: not logged in.');

      await client.ready();

      const result = await client.social.notifications.get(pk);

      if (!result.ok)
        throw new Error(
          `GET notifications:${pk} failed: ${result.error.message}`
        );

      return result.value;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getPost = async (uri: string): Promise<IPost | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get profile failed: not logged in.');
      if (!uri) throw new Error('Get list posts failed');

      await client.ready();

      const result = await client.social.posts.get(uri, {
        viewerId: pk,
      });

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

      if (!result.ok) {
        throw new Error(`Follow:${pk} failed: ${result.error.message}`);
      }

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

      if (!result.ok) {
        throw new Error(`Unfollow:${pk} failed: ${result.error.message}`);
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const searchUsers = async (text: string) => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Not logged in.');

      await client.ready();

      const result = await client.social.search.profiles(text, pk);

      if (!result.ok) {
        throw new Error(`Search failed: ${result.error.message}`);
      }

      return result.value;
    } catch (error) {
      console.log(error);
      return null;
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

      if (!result.ok) {
        throw new Error(`Delete post:${pk} failed: ${result.error.message}`);
      }

      const newPosts = JSON.parse(JSON.stringify(posts));
      delete newPosts[postId];
      setPosts(newPosts);

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

  const listBookmarkedPosts = async (
    cursor: string,
    sort: 'recent' | 'popularity'
  ): Promise<IFeed | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get bookmarked posts failed: not logged in.');

      await client.ready();

      const result = await client.social.streams.bookmarksFeed(pk, {
        limit: 6,
        cursor: cursor,
        sort: sort ? sort : 'recent',
      });

      if (!result.ok)
        throw new Error(
          `Get bookmarked posts: ${cursor} failed: ${result.error.message}`
        );

      return result.value as unknown as IFeed;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const listGlobalPosts = async (
    cursor: string,
    reach: 'following' | 'all' | 'followers' | 'friends',
    sort: 'recent' | 'popularity',
    tags?: string[]
  ): Promise<IFeed | null> => {
    try {
      const pk = await isLoggedIn();

      if (!pk) throw new Error('Get global posts failed: not logged in.');

      await client.ready();

      const result = await client.social.streams.get(pk, {
        limit: 6,
        cursor: cursor,
        reach: reach ? reach : 'all',
        tags: tags,
        sort: sort ? sort : 'recent',
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

      const profile = await getProfile();

      if (profile) {
        Utils.storage.set('pubky', result.value);
        setPubky(result.value);
      }

      return profile;
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
        seed,
        profile,
        posts,
        updateStatus,
        isLoggedIn,
        createPost,
        createRepost,
        createReply,
        getFile,
        getReplies,
        getNotifications,
        createBookmark,
        deleteBookmark,
        createTag,
        deleteTag,
        deletePost,
        getHotTags,
        getPost,
        listUserFeed,
        listBookmarkedPosts,
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
        getRecoveryFile,
        searchTags,
        setPosts,
        setSeed,
        setSearchTags,
        searchUsers,
        follow,
        unfollow,
        session,
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

  const linksArray = Object.entries(profile.links).map(([title, url]) => ({
    title,
    url,
  }));

  return {
    name: profile.name || 'anonymous',
    bio: profile?.bio || '',
    image: profile.image,
    links: linksArray,
    status: profile?.status || 'noStatus',
  };
};
