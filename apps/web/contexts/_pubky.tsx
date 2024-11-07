'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  PubkyClient,
  PublicKey,
  decryptRecoveryFile,
  Keypair,
  createRecoveryFile,
} from '@synonymdev/pubky';
import { Utils } from '@social/utils-shared';
import { PostKind, PostView, PubkyAppPost, PubkyAppUser } from '@/types/Post';
import { generateTimestampId } from 'libs/utils-shared/src/lib/Crypto/generateTimestampId';
import { UserDetails } from '@/types/User';
import { generateHashId } from 'libs/utils-shared/src/lib/Crypto/generateHashId';
import { TStatus } from '@/types';
import JSZip from 'jszip';
import * as bip39 from 'bip39';
import { getUserProfile } from '@/services/userService';
import { FilterContextType } from './_filters';

const HOMESERVER_PUBLIC_KEY = process.env.NEXT_PUBLIC_HOMESERVER;

const client = new PubkyClient();
const homeserver = PublicKey.from(HOMESERVER_PUBLIC_KEY);

type PubkyClientContextType = {
  pubky: string | undefined;
  seed: string | undefined;
  setSeed: (seed: string | undefined) => void;
  mnemonic: string | undefined;
  setMnemonic: (mnemonic: string | undefined) => void;
  profile: PubkyAppUser | undefined;
  loginWithFile: (password: string, recoveryFile: Buffer) => Promise<string>;
  loginWithMnemonic: (mnemonic: string) => Promise<string>;
  isLoggedIn: () => Promise<boolean>;
  logout: () => boolean;
  signUp: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  saveProfile: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  createPost: (
    postContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<{ uri: string; details: PubkyAppPost } | false>;
  editPost: (post: PostView, postContent: string) => Promise<string | false>;
  createArticle: (
    title: string,
    articleContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<{ uri: string; details: PubkyAppPost } | false>;
  createRepost: (
    originalPostId: string,
    originalauthorId: string,
    repostContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<string | false>;
  createReply: (
    originalPostUri: string,
    replyContent: string,
    kind: PostKind,
    files?: File[]
  ) => Promise<string | false>;
  follow: (user_id: string) => Promise<boolean>;
  unfollow: (user_id: string) => Promise<boolean>;
  deleteFile: (file_uri: string) => Promise<boolean>;
  mute: (user_id: string) => Promise<boolean>;
  unmute: (user_id: string) => Promise<boolean>;
  addBookmark: (postId: string, authorId: string) => Promise<boolean>;
  deleteBookmark: (bookmarkId: string) => Promise<boolean>;
  createTag: (
    authorId: string,
    postId: string,
    tagContent: string
  ) => Promise<boolean>;
  deleteTag: (
    author_id: string,
    post_id: string,
    tagLabel: string
  ) => Promise<boolean>;
  createTagProfile: (profileId: string, tagContent: string) => Promise<boolean>;
  deleteTagProfile: (profileId: string, tagLabel: string) => Promise<boolean>;
  getRecoveryFile: (password: string) => Promise<any | null>;
  storeProfile: (userProfile: UserDetails) => Promise<boolean>;
  updateStatus: (value: TStatus | string) => Promise<PubkyAppUser | undefined>;
  timeline: PostView[] | undefined;
  setTimeline: (timeline: PostView[]) => void;
  setSearchTags: (value: string[]) => any;
  searchTags: string[];
  repliesArray: PostView[] | undefined;
  setRepliesArray: (repliesArray: PostView[]) => void;
  timelineProfile: PostView[] | undefined;
  setTimelineProfile: (timelineProfile: PostView[]) => void;
  deletePost: (post_id: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  downloadData: () => Promise<boolean>;
  getTimestampNotification: () => Promise<number | boolean>;
  putTimestampNotification: (timestamp: number) => Promise<boolean>;
};

const PubkyClientContext = createContext({} as PubkyClientContextType);

export function PubkyClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [pubky, setPubky] = useState<string | undefined>(
    (Utils.storage.get('pubky_public_key') as string) || undefined
  );
  const [seed, setSeed] = useState<string | undefined>(
    (Utils.storage.get('seed') as string | undefined) || undefined
  );
  const [mnemonic, setMnemonic] = useState<string | undefined>(
    (Utils.storage.get('mnemonic') as string | undefined) || undefined
  );
  const [profile, setProfile] = useState<PubkyAppUser | undefined>(
    (Utils.storage.get('profile') as PubkyAppUser | undefined) || undefined
  );
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [timelineProfile, setTimelineProfile] = useState<PostView[]>([]);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [repliesArray, setRepliesArray] = useState<PostView[]>(
    {} as PostView[]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('base32.js')
        .then(() => {
          setWasmLoaded(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  if (!wasmLoaded) {
    return <div>Loading...</div>;
  }

  const logout = () => {
    try {
      if (pubky) {
        // Logout client
        client.signout(PublicKey.from(pubky));
      }

      // Clear storage and states
      Utils.storage.remove('pubky_public_key');
      Utils.storage.remove('seed');
      Utils.storage.remove('mnemonic');
      Utils.storage.remove('profile');
      Utils.storage.remove('timerRemind');
      Utils.storage.remove('backup');
      Utils.storage.remove('unread');
      setPubky(undefined);
      setSeed(undefined);
      setMnemonic(undefined);
      setProfile(undefined);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const isLoggedIn = async () => {
    if (!pubky) {
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
      const user = await getUserProfile(pk, pk);
      if (user?.details?.name === '[DELETED]') {
        throw new Error('This account has been deleted');
      }

      Utils.storage.set('pubky_public_key', pk);
      setPubky(pk);
      return pk;
    } catch (error: any) {
      // Get error message and return as a string
      console.log(error);
      throw new Error(error.message);
    }
  };

  const loginWithMnemonic = async (mnemonic: string) => {
    try {
      const seedMnemonic = bip39.mnemonicToSeedSync(mnemonic);
      const secretKey = seedMnemonic.slice(0, 32);
      const keypair = Keypair.fromSecretKey(secretKey);

      if (!keypair) {
        throw new Error('Invalid recovery phrase');
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
      const user = await getUserProfile(pk, pk);
      if (user?.details?.name === '[DELETED]') {
        throw new Error('This account has been deleted');
      }

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
      const mnemonic = bip39.generateMnemonic(128);
      const seedMnemonic = bip39.mnemonicToSeedSync(mnemonic);
      const secretKey = seedMnemonic.slice(0, 32);
      const newKeypair = Keypair.fromSecretKey(secretKey);

      const seed = Utils.uint8ArrayToBase64(newKeypair.secretKey());

      Utils.storage.set('seed', seed);
      setSeed(seed);

      Utils.storage.set('mnemonic', mnemonic);
      setMnemonic(mnemonic);

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

        const blobId = generateTimestampId().toUpperCase();
        const blobUrl = `pubky://${pk}/pub/pubky.app/blobs/${blobId}`;
        const blobBody = Buffer.from(fileContent);

        await client.put(blobUrl, blobBody);

        // Create the PubkyAppFile object
        const fileId = generateTimestampId().toUpperCase();
        const newFile = {
          name: file.name,
          created_at: Date.now(),
          src: blobUrl,
          content_type: file.type,
          size: file.size,
        };

        // Serialize to JSON and convert to Buffer
        const fileBody = Buffer.from(JSON.stringify(newFile));

        // File URL
        const fileUrl = `pubky://${pk}/pub/pubky.app/files/${fileId}`;

        // Send the file to the homeserver
        await client.put(fileUrl, fileBody);

        // Store the file URI

        userProfile.image = fileUrl;
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

        const blobId = generateTimestampId().toUpperCase();
        const blobUrl = `pubky://${pubky}/pub/pubky.app/blobs/${blobId}`;
        const blobBody = Buffer.from(fileContent);

        await client.put(blobUrl, blobBody);

        // Create the PubkyAppFile object
        const fileId = generateTimestampId().toUpperCase();
        const newFile = {
          name: file.name,
          created_at: Date.now(),
          src: blobUrl,
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

        userProfile.image = fileUrl;
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
  ): Promise<{ uri: string; details: PubkyAppPost } | false> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
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

          const blobId = generateTimestampId().toUpperCase();
          const blobUrl = `pubky://${pubky}/pub/pubky.app/blobs/${blobId}`;
          const blobBody = Buffer.from(fileContent);

          await client.put(blobUrl, blobBody);

          // Create the PubkyAppFile object
          const fileId = generateTimestampId().toUpperCase();
          const newFile = {
            name: file.name,
            created_at: Date.now(),
            src: blobUrl,
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
          uploadedFileUris.push(fileUrl);
        }

        // If there are files, add to the post attachments
        newPost.attachments = uploadedFileUris;
      }

      // Serialize the post to JSON and convert to Buffer
      const postBody = Buffer.from(JSON.stringify(newPost));

      // Post URL
      const postUrl = `pubky://${pubky}/pub/pubky.app/posts/${postId}`;

      // Send the post to the homeserver
      await client.put(postUrl, postBody);

      return { uri: postUrl, details: newPost };
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const createArticle = async (
    title: string,
    articleContent: string,
    kind: PostKind,
    files?: File[]
  ): Promise<{ uri: string; details: PubkyAppPost } | false> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      // Generate a timestamp ID for the article
      const articleId = generateTimestampId().toUpperCase();

      // Initialize the post object
      const newArticle: PubkyAppPost = {
        content: JSON.stringify({
          title: title,
          body: articleContent,
        }),
        kind,
      };

      // List to store URIs of uploaded files
      const uploadedFileUris: string[] = [];

      // File upload, if any
      if (files && files.length > 0) {
        for (const file of files) {
          // Read the file content
          const fileContent = await file.arrayBuffer();

          const blobId = generateTimestampId().toUpperCase();
          const blobUrl = `pubky://${pubky}/pub/pubky.app/blobs/${blobId}`;
          const blobBody = Buffer.from(fileContent);

          await client.put(blobUrl, blobBody);

          // Create the PubkyAppFile object
          const fileId = generateTimestampId().toUpperCase();
          const newFile = {
            name: file.name,
            created_at: Date.now(),
            src: blobUrl,
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
          uploadedFileUris.push(fileUrl);
        }

        // If there are files, add to the post attachments
        newArticle.attachments = uploadedFileUris;
      }

      // Serialize the post to JSON and convert to Buffer
      const articleBody = Buffer.from(JSON.stringify(newArticle));

      // Post URL
      const articleUrl = `pubky://${pubky}/pub/pubky.app/posts/${articleId}`;

      // Send the post to the homeserver
      await client.put(articleUrl, articleBody);

      return { uri: articleUrl, details: newArticle };
    } catch (error) {
      console.error('Error creating article:', error);
      return false;
    }
  };

  const editPost = async (post: PostView, postContent: string) => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const editPost: PubkyAppPost = {
        content: postContent,
        kind: post?.details?.kind,
        attachments: post?.details?.attachments,
        relationships: post?.relationships,
      };

      // Serialize the post to JSON and convert to Buffer
      const postBody = Buffer.from(JSON.stringify(editPost));

      // Post URL
      const postUrl = `pubky://${pubky}/pub/pubky.app/posts/${post?.details?.id}`;

      // Send the post to the homeserver
      await client.put(postUrl, postBody);

      return postUrl;
    } catch (error) {
      console.error('Error editing post:', error);
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const profileUrl = `pubky://${pubky}/pub/pubky.app/profile.json`;
      const lists = await client.list(profileUrl);

      await Promise.all(
        lists.map(async (list) => {
          await client.delete(list);
        })
      );

      return true;
    } catch (error) {
      console.error('Error editing post:', error);
      return false;
    }
  };

  const downloadData = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const profileUrl = `pubky://${pubky}/pub/pubky.app/profile.json`;
      const lists = await client.list(profileUrl);

      const zip = new JSZip();
      const dataFolder = zip.folder('data');
      if (!dataFolder) {
        throw new Error("Error creating 'data' folder in zip.");
      }

      await Promise.all(
        lists.slice(0, 2).map(async (list, index) => {
          const result = await client.get(list);

          if (result === undefined) {
            console.warn(`File ${index + 1} was not found or is undefined.`);
            return; // Skip
          }

          let parsedData;
          let fileName;
          try {
            const decoder = new TextDecoder('utf-8');
            const decodedString = decoder.decode(result);
            parsedData = JSON.parse(decodedString);
            fileName = `${index + 1}.json`;
            dataFolder.file(fileName, JSON.stringify(parsedData, null, 2));
          } catch (error) {
            console.warn(
              `File ${
                index + 1
              } is not in JSON format. It will be saved as a binary file.`
            );
            fileName = `${index + 1}.bin`;
            dataFolder.file(fileName, result);
          }
        })
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.zip';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading data:', error);
      return false;
    }
  };

  const getTimestampNotification = async () => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const lastReadUrl = `pubky://${pubky}/pub/pubky.app/last_read`;
      const lastRead = await client.get(lastReadUrl);
      const jsonString =
        lastRead &&
        Object.values(lastRead)
          .map((asciiCode: number) => String.fromCharCode(asciiCode))
          .join('');

      const parsedData = jsonString && JSON.parse(jsonString);
      const timestamp = Number(parsedData.timestamp);

      return timestamp;
    } catch (error) {
      // console.error('Error get timestamp:', error);
      return false;
    }
  };

  const putTimestampNotification = async (timestamp: number) => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const body = { timestamp: timestamp };
      const lastReadBody = Buffer.from(JSON.stringify(body));

      const lastReadUrl = `pubky://${pubky}/pub/pubky.app/last_read`;
      await client.put(lastReadUrl, lastReadBody);

      return true;
    } catch (error) {
      console.error('Error put timestamp:', error);
      return false;
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      // Post URL
      const postUrl = `pubky://${pubky}/pub/pubky.app/posts/${postId}`;

      // Send the post to the homeserver
      await client.delete(postUrl);

      return true;
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
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
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
          const blobId = generateTimestampId().toUpperCase();
          const blobUrl = `pubky://${pubky}/pub/pubky.app/blobs/${blobId}`;
          const blobBody = Buffer.from(fileContent);

          await client.put(blobUrl, blobBody);

          // Create the PubkyAppFile object
          const fileId = generateTimestampId().toUpperCase();
          const newFile = {
            name: file.name,
            created_at: Date.now(),
            src: blobUrl,
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
          uploadedFileUris.push(fileUrl);
        }

        // If there are files, add to the repost attachments
        newRepost.attachments = uploadedFileUris;
      }

      // Serialize the repost to JSON and convert to Buffer
      const repostBody = Buffer.from(JSON.stringify(newRepost));

      // Repost URL
      const repostUrl = `pubky://${pubky}/pub/pubky.app/posts/${repostId}`;

      // Send the post to the homeserver
      await client.put(repostUrl, repostBody);

      return repostUrl;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const createReply = async (
    originalPostUri: string,
    replyContent: string,
    kind: PostKind,
    files?: File[]
  ): Promise<string | false> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }
      const replyId = generateTimestampId().toUpperCase();

      const replyPost: PubkyAppPost = {
        content: replyContent,
        kind,
        parent: originalPostUri,
      };

      const uploadedFileUris: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const fileContent = await file.arrayBuffer();
          const blobId = generateTimestampId().toUpperCase();
          const blobUrl = `pubky://${pubky}/pub/pubky.app/blobs/${blobId}`;
          const blobBody = Buffer.from(fileContent);

          await client.put(blobUrl, blobBody);

          const fileId = generateTimestampId().toUpperCase();
          const newFile = {
            name: file.name,
            created_at: Date.now(),
            src: blobUrl,
            content_type: file.type,
            size: file.size,
          };

          const fileBody = Buffer.from(JSON.stringify(newFile));

          const fileUrl = `pubky://${pubky}/pub/pubky.app/files/${fileId}`;

          await client.put(fileUrl, fileBody);

          uploadedFileUris.push(fileUrl);
        }

        // If there are files, add to the reply attachments
        replyPost.attachments = uploadedFileUris;
      }

      const replyBody = Buffer.from(JSON.stringify(replyPost));
      const replyUrl = `pubky://${pubky}/pub/pubky.app/posts/${replyId}`;

      await client.put(replyUrl, replyBody);

      return replyUrl;
    } catch (error) {
      console.error('Error while replying to post:', error);
      return false;
    }
  };

  const follow = async (user_id: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const followData = {
        created_at: Date.now(),
      };

      const followDataBody = Buffer.from(JSON.stringify(followData));
      const followUrl = `pubky://${pubky}/pub/pubky.app/follows/${user_id}`;

      await client.put(followUrl, followDataBody);

      return true;
    } catch (error) {
      console.error('Error while following the user:', error);
      return false;
    }
  };

  const unfollow = async (user_id: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const followUrl = `pubky://${pubky}/pub/pubky.app/follows/${user_id}`;

      await client.delete(followUrl);

      return true;
    } catch (error) {
      console.error('Error while unfollowing the user:', error);
      return false;
    }
  };

  const deleteFile = async (file_uri: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      await client.delete(file_uri);

      return true;
    } catch (error) {
      console.error('Error while unfollowing the user:', error);
      return false;
    }
  };

  const mute = async (user_id: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const muteData = {
        created_at: Date.now(),
      };

      const muteDataBody = Buffer.from(JSON.stringify(muteData));
      const muteUrl = `pubky://${pubky}/pub/pubky.app/mutes/${user_id}`;

      await client.put(muteUrl, muteDataBody);

      return true;
    } catch (error) {
      console.error('Error while muting the user:', error);
      return false;
    }
  };

  const unmute = async (user_id: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const muteUrl = `pubky://${pubky}/pub/pubky.app/mutes/${user_id}`;

      await client.delete(muteUrl);

      return true;
    } catch (error) {
      console.error('Error while unmuting the user:', error);
      return false;
    }
  };

  const addBookmark = async (
    postId: string,
    authorId: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
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

      return true;
    } catch (error) {
      console.error('Error while bookmarking the post:', error);
      return false;
    }
  };

  const deleteBookmark = async (bookmarkId: string): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in or pubky is not defined');
      }

      const bookmarkUrl = `pubky://${pubky}/pub/pubky.app/bookmarks/${bookmarkId}`;

      await client.delete(bookmarkUrl);

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
      if (!loggedIn) {
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

      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const saveFeed = async (
    filter: FilterContextType,
    name: string,
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const feedData = {
        filter,
        name,
        created_at: Date.now(),
      };

      const feedBody = Buffer.from(JSON.stringify(feedData));
      const feedId = (
        await generateHashId(JSON.stringify(filter).toLocaleUpperCase())
      ).toUpperCase();

      const feedUrl = `pubky://${pubky}/pub/pubky.app/feeds/${feedId}`;

      await client.put(feedUrl, feedBody);

      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const loadFeeds = async (): Promise<{ filter: FilterContextType; name: string }[]> => {
    try {
      // Verify the user is logged in
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }
  
      // Define the feeds directory path
      const feedsDirUrl = `pubky://${pubky}/pub/pubky.app/feeds/`;
      const feedUris = await client.list(feedsDirUrl);
  
      // Fetch each feed data
      const feedsData = await Promise.all(
        feedUris.map(async (uri) => {
          try {
            const result = await client.get(uri);
            if (result) {
              const decodedString = new TextDecoder('utf-8').decode(result);
              const parsedData = JSON.parse(decodedString);
              return { filter: parsedData.filter, name: parsedData.name };
            }
            return null; // Handle cases where the result might be undefined
          } catch (error) {
            console.error(`Error fetching feed from ${uri}:`, error);
            return null;
          }
        })
      );
  
      // Filter out any null entries and assert the result type
      return feedsData.filter((feed): feed is { filter: FilterContextType; name: string } => feed !== null);
    } catch (error) {
      console.error('Error loading feeds:', error);
      return [];
    }
  };

  const deleteFeed = async (filter: FilterContextType): Promise<boolean> => {
    try {
      // Verify the user is logged in
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }
  
      // Compute the hash ID for the feed based on the filter
      const feedId = (await generateHashId(JSON.stringify(filter))).toUpperCase();
  
      // Construct the feed URL
      const feedUrl = `pubky://${pubky}/pub/pubky.app/feeds/${feedId}`;
  
      // Delete the feed from the homeserver
      await client.delete(feedUrl);
  
      return true;
    } catch (error) {
      console.error('Error deleting feed:', error);
      return false;
    }
  };

  const deleteTag = async (
    authorId: string,
    postId: string,
    tagLabel: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const uriPost = `pubky://${authorId}/pub/pubky.app/posts/${postId}`;

      const tagId = (
        await generateHashId(`${uriPost}:${tagLabel}`)
      ).toUpperCase();
      const tagUrl = `pubky://${pubky}/pub/pubky.app/tags/${tagId}`;

      await client.delete(tagUrl);

      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  };

  const createTagProfile = async (
    profileId: string,
    tagContent: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
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

      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const deleteTagProfile = async (
    profileId: string,
    tagLabel: string
  ): Promise<boolean> => {
    try {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        throw new Error('User is not logged in');
      }

      const profileUri = `pubky://${profileId}/pub/pubky.app/profile.json`;
      const tagId = (
        await generateHashId(`${profileUri}:${tagLabel}`)
      ).toUpperCase();
      const tagUrl = `pubky://${pubky}/pub/pubky.app/tags/${tagId}`;

      await client.delete(tagUrl);

      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const toPubkeyProfile = (profile: PubkyAppUser): PubkyAppUser => {
    if (!profile) throw new Error('Profile is required');

    //const linksArray = Object.entries(profile.links || {}).map(
    //  ([title, url]) => ({
    //    title,
    //    url,
    //  })
    //);

    return {
      name: profile.name || 'anonymous',
      bio: profile.bio || '',
      image: profile.image,
      links:
        profile?.links && profile?.links?.length > 0
          ? profile?.links
          : undefined,
      status: profile.status || 'noStatus',
    };
  };

  return (
    <PubkyClientContext.Provider
      value={{
        pubky,
        seed,
        profile,
        mnemonic,
        loginWithFile,
        loginWithMnemonic,
        isLoggedIn,
        logout,
        signUp,
        setSeed,
        setMnemonic,
        saveProfile,
        createPost,
        editPost,
        deletePost,
        follow,
        unfollow,
        deleteFile,
        mute,
        unmute,
        addBookmark,
        deleteBookmark,
        createRepost,
        createReply,
        createTag,
        createArticle,
        deleteTag,
        createTagProfile,
        deleteTagProfile,
        deleteAccount,
        getRecoveryFile,
        storeProfile,
        updateStatus,
        setTimeline,
        timeline,
        setSearchTags,
        searchTags,
        repliesArray,
        setRepliesArray,
        timelineProfile,
        setTimelineProfile,
        getTimestampNotification,
        putTimestampNotification,
        downloadData,
      }}
    >
      {children}
    </PubkyClientContext.Provider>
  );
}

export function usePubkyClientContext() {
  return useContext(PubkyClientContext);
}
