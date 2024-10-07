/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState } from 'react';
import {
  PubkyClient,
  PublicKey,
  decryptRecoveryFile,
  Keypair,
  createRecoveryFile,
} from '@synonymdev/pubky';
import { Utils } from '@social/utils-shared';
import {
  PostKind,
  PubkyAppFile,
  PubkyAppPost,
  PubkyAppUser,
} from '@/types/Post';
import { generateTimestampId } from 'libs/utils-shared/src/lib/Crypto/generateTimestampId';
import { UserDetails } from '@/types/User';
import { generateHashId } from 'libs/utils-shared/src/lib/Crypto/generateHashId';
import { TStatus } from '@/types';

const HOMESERVER_PUBLIC_KEY = process.env.NEXT_PUBLIC_HOMESERVER;

const client = new PubkyClient();
const homeserver = PublicKey.from(HOMESERVER_PUBLIC_KEY);

type PubkyClientContextType = {
  pubky: string | undefined;
  seed: string | undefined;
  setSeed: (seed: string | undefined) => void;
  profile: PubkyAppUser | undefined;
  loginWithFile: (password: string, recoveryFile: Buffer) => Promise<string>;
  isLoggedIn: () => Promise<boolean>;
  logout: () => boolean;
  signUp: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  saveProfile: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  createPost: (
    postContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<string | false>;
  createRepost: (
    originalPostId: string,
    originalauthorId: string,
    repostContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<string | false>;
  createReply: (
    originalPostId: string,
    replyContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<string | false>;
  follow: (user_id: string) => Promise<boolean>;
  unfollow: (user_id: string) => Promise<boolean>;
  addBookmark: (postId: string, authorId: string) => Promise<boolean>;
  deleteBookmark: (bookmarkId: string) => Promise<boolean>;
  createTag: (
    authorId: string,
    postId: string,
    tagContent: string
  ) => Promise<boolean>;
  deleteTag: (post_id: string, tagId: string) => Promise<boolean>;
  createTagProfile: (profileId: string, tagContent: string) => Promise<boolean>;
  deleteTagProfile: (profileId: string, tagId: string) => Promise<boolean>;
  getRecoveryFile: (password: string) => Promise<any | null>;
  storeProfile: (userProfile: UserDetails) => Promise<boolean>;
  updateStatus: (value: TStatus | string) => Promise<PubkyAppUser | undefined>;
};

const PubkyClientContext = createContext({} as PubkyClientContextType);

export function PubkyClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pubky, setPubky] = useState<string | undefined>(
    (Utils.storage.get('pubky_public_key') as string) || undefined
  );
  const [seed, setSeed] = useState<string | undefined>(
    (Utils.storage.get('seed') as string | undefined) || undefined
  );
  const [profile, setProfile] = useState<PubkyAppUser | undefined>(
    (Utils.storage.get('profile') as PubkyAppUser | undefined) || undefined
  );

  const logout = () => {
    try {
      if (pubky) {
        // Logout client
        client.signout(PublicKey.from(pubky));
      }

      // Clear storage and states
      Utils.storage.remove('pubky_public_key');
      Utils.storage.remove('seed');
      Utils.storage.remove('profile');
      setPubky(undefined);
      setSeed(undefined);
      setProfile(undefined);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const isLoggedIn = async () => {
    if (!pubky) return false;

    const session = await client.session(PublicKey.from(pubky));

    if (!session) {
      Utils.storage.remove('pubky_public_key');
      setPubky(undefined);
      return false;
    }

    return true;
  };

  const getRecoveryFile = async (password: string): Promise<any | null> => {
    try {
      const base64Seed = Utils.storage.get('seed');
      const uint8ArraySeed = Utils.base64ToUint8Array(base64Seed);

      // get keypair from uint8ArraySeed
      const keypair = Keypair.fromSecretKey(uint8ArraySeed);

      return createRecoveryFile(keypair, password);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const loginWithFile = async (password: string, recoveryFile: Buffer) => {
    try {
      const keypair = decryptRecoveryFile(recoveryFile, password);

      if (!keypair) {
        throw new Error('Invalid recovery file');
      }

      // Sign up
      await client.signup(keypair, homeserver);

      // Get session
      const session = await client.session(keypair.publicKey());

      if (!session) {
        throw new Error('Failed to get session');
      }

      // Save pubky state
      const pk = session.pubky().z32();
      Utils.storage.set('pubky_public_key', pk);
      setPubky(pk);

      return pk;
    } catch (error: any) {
      // Get error message and return as a string
      console.log(error);
      throw new Error(error.message);
    }
  };

  const signUp = async (userProfile: PubkyAppUser): Promise<any | false> => {
    try {
      const newKeypair = Keypair.random();

      const seed = Utils.uint8ArrayToBase64(newKeypair.secretKey());

      Utils.storage.set('seed', seed);
      setSeed(seed);

      // Sign up
      await client.signup(newKeypair, homeserver);

      // Get session
      const session = await client.session(newKeypair.publicKey());

      if (!session) {
        throw new Error('Failed to get session');
      }

      // Save pubky state
      const pk = session.pubky().z32();
      Utils.storage.set('pubky_public_key', pk);
      setPubky(pk);

      if (userProfile.image instanceof File) {
        const file = userProfile.image;
        const fileContent = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileContent).toString('base64');

        // Create the PubkyAppFile object
        const fileId = generateTimestampId().toUpperCase();
        const newFile: PubkyAppFile = {
          name: file.name,
          created_at: Date.now(),
          src: `data:${file.type};base64,${fileBase64}`,
          content_type: file.type,
          size: file.size,
        };

        // Serialize to JSON and convert to Buffer
        const fileBody = Buffer.from(JSON.stringify(newFile));

        // File URL
        const fileUrl = `pubky://${pubky}/pub/pubky.app/files/${fileId}`;

        // Send the file to the homeserver
        await client.put(fileUrl, fileBody);

        // Store the file URI
        const fileUri = `/pub/pubky.app/files/${fileId}`;

        userProfile.image = fileUri;
      }

      // Transform the profile to the PubkyAppUser format
      const pubkeyProfile: PubkyAppUser = toPubkeyProfile(userProfile);

      // Save the profile in storage
      Utils.storage.set('profile', JSON.stringify(pubkeyProfile));
      setProfile(pubkeyProfile);

      // Serialize to JSON and convert to Buffer
      const body = Buffer.from(JSON.stringify(pubkeyProfile));

      // Profile URL (fixed address)
      const profileUrl = `pubky://${pk}/pub/pubky.app/profile.json`;

      // Send the profile to the homeserver
      await client.put(profileUrl, body);

      return pubkeyProfile;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const storeProfile = async (userProfile: UserDetails): Promise<boolean> => {
    // Save the profile in storage
    Utils.storage.set('profile', JSON.stringify(userProfile));
    setProfile(userProfile);

    return true;
  };

  const saveProfile = async (
    userProfile: PubkyAppUser
  ): Promise<any | false> => {
    try {
      const loggedIn = isLoggedIn();

      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      if (userProfile.image instanceof File) {
        const file = userProfile.image;
        const fileContent = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileContent).toString('base64');

        // Create the PubkyAppFile object
        const fileId = generateTimestampId().toUpperCase();
        const newFile: PubkyAppFile = {
          name: file.name,
          created_at: Date.now(),
          src: `data:${file.type};base64,${fileBase64}`,
          content_type: file.type,
          size: file.size,
        };

        // Serialize to JSON and convert to Buffer
        const fileBody = Buffer.from(JSON.stringify(newFile));

        // File URL
        const fileUrl = `pubky://${pubky}/pub/pubky.app/files/${fileId}`;

        // Send the file to the homeserver
        await client.put(fileUrl, fileBody);

        // Store the file URI
        const fileUri = `/pub/pubky.app/files/${fileId}`;

        userProfile.image = fileUri;
      }

      // Transform the profile to the PubkyAppUser format
      const pubkeyProfile: PubkyAppUser = toPubkeyProfile(userProfile);

      // Save the profile in storage
      Utils.storage.set('profile', JSON.stringify(pubkeyProfile));
      setProfile(pubkeyProfile);

      // Serialize to JSON and convert to Buffer
      const body = Buffer.from(JSON.stringify(pubkeyProfile));

      // Profile URL (fixed address)
      const profileUrl = `pubky://${pubky}/pub/pubky.app/profile.json`;

      // Send the profile to the homeserver
      await client.put(profileUrl, body);

      return pubkeyProfile;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const updateStatus = async (value: TStatus | string) => {
    try {
      if (!pubky) throw new Error('Pubky required');
      if (!profile) throw new Error('Profile required');

      const updatedProfile = {
        ...profile,
        status: value,
      };

      // Transform the profile to the PubkyAppUser format
      const pubkeyProfile: PubkyAppUser = toPubkeyProfile(updatedProfile);

      // Save the profile in storage
      Utils.storage.set('profile', JSON.stringify(pubkeyProfile));
      setProfile(pubkeyProfile);

      // Serialize to JSON and convert to Buffer
      const body = Buffer.from(JSON.stringify(pubkeyProfile));

      // Profile URL (fixed address)
      const profileUrl = `pubky://${pubky}/pub/pubky.app/profile.json`;

      // Send the profile to the homeserver
      await client.put(profileUrl, body);

      return pubkeyProfile;
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (
    postContent: string,
    kind: PostKind,
    files?: File[]
  ): Promise<string | false> => {
    try {
      // Check if the user is logged in
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in');
      }

      // Generate a timestamp ID for the post
      const postId = generateTimestampId().toUpperCase();

      // Initialize the post object
      const newPost: PubkyAppPost = {
        content: postContent,
        kind,
      };

      // List to store URIs of uploaded files
      const uploadedFileUris: string[] = [];

      // File upload, if any
      if (files && files.length > 0) {
        for (const file of files) {
          // Read the file content
          const fileContent = await file.arrayBuffer();
          const fileBase64 = Buffer.from(fileContent).toString('base64');

          // Create the PubkyAppFile object
          const fileId = generateTimestampId().toUpperCase();
          const newFile: PubkyAppFile = {
            name: file.name,
            created_at: Date.now(),
            src: `data:${file.type};base64,${fileBase64}`,
            content_type: file.type,
            size: file.size,
          };

          // Serialize to JSON and convert to Buffer
          const fileBody = Buffer.from(JSON.stringify(newFile));

          // File URL
          const fileUrl = `pubky://${pubky}/pub/pubky.app/files/${fileId}`;

          // Send the file to the homeserver
          await client.put(fileUrl, fileBody);

          // Store the file URI
          const fileUri = `/pub/pubky.app/files/${fileId}`;
          uploadedFileUris.push(fileUri);
        }

        // If there are files, add to the post embed
        newPost.embed = {
          kind: kind,
          uri: uploadedFileUris[0], // Use the first file as the main embed
        };
      }

      // Serialize the post to JSON and convert to Buffer
      const postBody = Buffer.from(JSON.stringify(newPost));

      // Post URL
      const postUrl = `pubky://${pubky}/pub/pubky.app/posts/${postId}`;

      // Send the post to the homeserver
      await client.put(postUrl, postBody);

      console.log(postUrl);

      return postUrl;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const createRepost = async (
    originalPostId: string,
    originalauthorId: string,
    repostContent: string,
    kind: PostKind,
    files?: File[]
  ): Promise<string | false> => {
    try {
      // Check if the user is logged in
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in');
      }

      // Generate a timestamp ID for the repost
      const repostId = generateTimestampId().toUpperCase();

      // Initialize the post object
      const newRepost: PubkyAppPost = {
        content: repostContent,
        embed: {
          kind: 'Short',
          uri: `pubky://${originalauthorId}/pub/pubky.app/posts/${originalPostId}`,
        },
        kind,
      };

      // List to store URIs of uploaded files
      const uploadedFileUris: string[] = [];

      // File upload, if any
      if (files && files.length > 0) {
        for (const file of files) {
          // Read the file content
          const fileContent = await file.arrayBuffer();
          const fileBase64 = Buffer.from(fileContent).toString('base64');

          // Create the PubkyAppFile object
          const fileId = generateTimestampId().toUpperCase();
          const newFile: PubkyAppFile = {
            name: file.name,
            created_at: Date.now(),
            src: `data:${file.type};base64,${fileBase64}`,
            content_type: file.type,
            size: file.size,
          };

          // Serialize to JSON and convert to Buffer
          const fileBody = Buffer.from(JSON.stringify(newFile));

          // File URL
          const fileUrl = `pubky://${pubky}/pub/pubky.app/files/${fileId}`;

          // Send the file to the homeserver
          await client.put(fileUrl, fileBody);

          // Store the file URI
          const fileUri = `/pub/pubky.app/files/${fileId}`;
          uploadedFileUris.push(fileUri);
        }

        // If there are files, add to the post embed
        newRepost.embed = {
          kind: kind,
          uri: uploadedFileUris[0],
          postId: originalPostId,
        };
      }

      // Serialize the repost to JSON and convert to Buffer
      const repostBody = Buffer.from(JSON.stringify(newRepost));

      // Repost URL
      const repostUrl = `pubky://${pubky}/pub/pubky.app/posts/${repostId}`;

      // Send the post to the homeserver
      await client.put(repostUrl, repostBody);

      console.log(repostUrl);

      return repostUrl;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const createReply = async (
    originalPostId: string,
    replyContent: string,
    kind: PostKind,
    files?: File[]
  ): Promise<string | false> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in');
      }
      const replyId = generateTimestampId().toUpperCase();

      const replyPost: PubkyAppPost = {
        content: replyContent,
        kind,
        parent: originalPostId,
      };

      const uploadedFileUris: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const fileContent = await file.arrayBuffer();
          const fileBase64 = Buffer.from(fileContent).toString('base64');

          const fileId = generateTimestampId().toUpperCase();
          const newFile: PubkyAppFile = {
            name: file.name,
            created_at: Date.now(),
            src: `data:${file.type};base64,${fileBase64}`,
            content_type: file.type,
            size: file.size,
          };

          const fileBody = Buffer.from(JSON.stringify(newFile));

          const fileUrl = `pubky://${pubky}/pub/pubky.app/files/${fileId}`;

          await client.put(fileUrl, fileBody);

          const fileUri = `/pub/pubky.app/files/${fileId}`;
          uploadedFileUris.push(fileUri);
        }

        replyPost.embed = {
          kind: kind,
          uri: uploadedFileUris[0],
        };
      }

      const replyBody = Buffer.from(JSON.stringify(replyPost));
      const replyUrl = `pubky://${pubky}/pub/pubky.app/posts/${replyId}`;

      await client.put(replyUrl, replyBody);

      console.log(`Successfully replied: ${replyUrl}`);

      return replyUrl;
    } catch (error) {
      console.error('Error while replying to post:', error);
      return false;
    }
  };

  const follow = async (user_id: string): Promise<boolean> => {
    try {
      // Check if the user is logged in
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const followData = {
        created_at: Date.now(),
      };

      const followDataBody = Buffer.from(JSON.stringify(followData));
      const followUrl = `pubky://${pubky}/pub/pubky.app/follows/${user_id}`;

      await client.put(followUrl, followDataBody);

      console.log(`Successfully followed user with ID: ${user_id}`);
      return true;
    } catch (error) {
      console.error('Error while following the user:', error);
      return false;
    }
  };

  const unfollow = async (user_id: string): Promise<boolean> => {
    try {
      // Check if the user is logged in
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const followUrl = `pubky://${pubky}/pub/pubky.app/follows/${user_id}`;

      await client.delete(followUrl);

      console.log(`Successfully unfollowed user with ID: ${user_id}`);
      return true;
    } catch (error) {
      console.error('Error while unfollowing the user:', error);
      return false;
    }
  };

  const addBookmark = async (
    postId: string,
    authorId: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const bookmarkData = {
        uri: `pubky://${authorId}/pub/pubky.app/posts/${postId}`,
        created_at: Date.now(),
      };

      const bookmarkDataBody = Buffer.from(JSON.stringify(bookmarkData));
      const bookmarkId = (await generateHashId(bookmarkData.uri)).toUpperCase();
      const bookmarkUrl = `pubky://${pubky}/pub/pubky.app/bookmarks/${bookmarkId}`;

      await client.put(bookmarkUrl, bookmarkDataBody);

      console.log(`Successfully bookmarked post with ID: ${bookmarkId}`);
      return true;
    } catch (error) {
      console.error('Error while bookmarking the post:', error);
      return false;
    }
  };

  const deleteBookmark = async (bookmarkId: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const bookmarkUrl = `pubky://${pubky}/pub/pubky.app/bookmarks/${bookmarkId}`;

      await client.delete(bookmarkUrl);

      console.log(`Successfully unbookmarked post with ID: ${bookmarkId}`);
      return true;
    } catch (error) {
      console.error('Error while unbookmarking the post:', error);
      return false;
    }
  };

  const createTag = async (
    authorId: string,
    postId: string,
    tagContent: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in');
      }

      if (!tagContent || tagContent.trim() === '') {
        throw new Error('Tag content cannot be empty');
      }

      const tagData = {
        uri: `pubky://${authorId}/pub/pubky.app/posts/${postId}`,
        label: tagContent,
        created_at: Date.now(),
      };

      const tagBody = Buffer.from(JSON.stringify(tagData));
      const tagId = (
        await generateHashId(`${tagData.uri}:${tagData.label}`)
      ).toUpperCase();

      const tagUrl = `pubky://${pubky}/pub/pubky.app/tags/${tagId}`;

      await client.put(tagUrl, tagBody);

      console.log(`Tag successfully added ${tagId}: ${tagUrl}`);
      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const deleteTag = async (id: string, tagId: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in');
      }
      const tagUrl = `pubky://${pubky}/pub/pubky.app/tags/${tagId}`;

      await client.delete(tagUrl);

      console.log(`Tag successfully deleted ${id}: ${tagUrl}`);
      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const createTagProfile = async (
    profileId: string,
    tagContent: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in');
      }

      if (!tagContent || tagContent.trim() === '') {
        throw new Error('Tag content cannot be empty');
      }

      const tagData = {
        uri: `pubky://${profileId}/pub/pubky.app/profile.json`,
        label: tagContent,
        created_at: Date.now(),
      };

      const tagBody = Buffer.from(JSON.stringify(tagData));
      const tagId = (
        await generateHashId(`${tagData.uri}:${tagData.label}`)
      ).toUpperCase();

      const tagUrl = `pubky://${pubky}/pub/pubky.app/tags/${tagId}`;

      await client.put(tagUrl, tagBody);

      console.log(`Tag successfully added ${tagId}: ${tagUrl}`);
      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const deleteTagProfile = async (
    profileId: string,
    tagId: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn || !pubky) {
        throw new Error('User is not logged in');
      }

      const tagUrl = `pubky://${pubky}/pub/pubky.app/tags/${tagId}`;

      await client.delete(tagUrl);

      console.log(`Tag successfully deleted ${profileId}: ${tagUrl}`);
      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const toPubkeyProfile = (profile: PubkyAppUser): PubkyAppUser => {
    if (!profile) throw new Error('Profile is required');

    const linksArray = Object.entries(profile.links || {}).map(
      ([title, url]) => ({
        title,
        url,
      })
    );

    return {
      name: profile.name || 'anonymous',
      bio: profile.bio || '',
      image: profile.image,
      links: linksArray.length > 0 ? linksArray : undefined,
      status: profile.status || 'noStatus',
    };
  };

  return (
    <PubkyClientContext.Provider
      value={{
        pubky,
        seed,
        profile,
        loginWithFile,
        isLoggedIn,
        logout,
        signUp,
        setSeed,
        saveProfile,
        createPost,
        follow,
        unfollow,
        addBookmark,
        deleteBookmark,
        createRepost,
        createReply,
        createTag,
        deleteTag,
        createTagProfile,
        deleteTagProfile,
        getRecoveryFile,
        storeProfile,
        updateStatus,
      }}
    >
      {children}
    </PubkyClientContext.Provider>
  );
}

export function usePubkyClientContext() {
  return useContext(PubkyClientContext);
}
