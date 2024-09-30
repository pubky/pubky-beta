/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState } from 'react';
import {
  PubkyClient,
  PublicKey,
  decryptRecoveryFile,
  Keypair,
} from '@synonymdev/pubky';
import { Utils } from '@social/utils-shared';
import {
  PostKind,
  PubkyAppFile,
  PubkyAppPost,
  PubkyAppUser,
} from '@/types/Post';
import { generateTimestampId } from 'libs/utils-shared/src/lib/Crypto/generateTimestampId';

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
  getProfile: (profilePublicKey: string) => Promise<PubkyAppUser | null>;
  saveProfile: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  createPost: (
    postContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<string | false>;
  follow: (user_id: string) => Promise<boolean>;
  unfollow: (user_id: string) => Promise<boolean>;
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

      // Retrieve and save the profile
      const fetchedProfile = await getProfile(pk);
      if (fetchedProfile) {
        Utils.storage.set('profile', JSON.stringify(fetchedProfile));
        setProfile(fetchedProfile);
      } else {
        throw new Error('Failed to retrieve profile');
      }

      return session.pubky().z32();
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

      const fetchedProfile = await getProfile(pk);

      return fetchedProfile;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const saveProfile = async (
    userProfile: PubkyAppUser
  ): Promise<any | false> => {
    try {
      const loggedIn = isLoggedIn();

      if (!loggedIn) {
        throw new Error('User is not logged in');
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

      const fetchedProfile = await getProfile(pubky as string);

      return fetchedProfile;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const getProfile = async (
    profilePublicKey: string
  ): Promise<PubkyAppUser | null> => {
    const profileUrl = `pubky://${profilePublicKey}/pub/pubky.app/profile.json`;

    try {
      const response = await client.get(profileUrl);
      if (response) {
        const profileJson = Buffer.from(response).toString('utf-8');
        return JSON.parse(profileJson);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving profile:', error);
      return null;
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
      const postId = generateTimestampId();

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
          const fileId = generateTimestampId();
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
        getProfile,
        saveProfile,
        createPost,
        follow,
        unfollow,
      }}
    >
      {children}
    </PubkyClientContext.Provider>
  );
}

export function usePubkyClientContext() {
  return useContext(PubkyClientContext);
}
