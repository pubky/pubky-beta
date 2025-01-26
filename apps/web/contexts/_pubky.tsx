'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  Client,
  PublicKey,
  decryptRecoveryFile,
  Keypair,
  createRecoveryFile,
} from '@synonymdev/pubky';
import { Utils } from '@social/utils-shared';
import {
  PostCounts,
  PostDetails,
  PostKind,
  PostView,
  PubkyAppPost,
} from '@/types/Post';
import { UserDetails } from '@/types/User';
import { ICustomFeed, NotificationPreferences, TStatus } from '@/types';
import JSZip from 'jszip';
import * as bip39 from 'bip39';
import { getUserRelationship } from '@/services/userService';

const HOMESERVER_PUBLIC_KEY = process.env.NEXT_PUBLIC_HOMESERVER;
const TESTNET = process.env.NEXT_PUBLIC_TESTNET?.toLocaleLowerCase() === 'true';
const NEXT_PUBLIC_DEFAULT_HTTP_RELAY =
  process.env.NEXT_PUBLIC_DEFAULT_HTTP_RELAY ||
  'https://demo.httprelay.io/link/';

import init, {
  PubkySpecsBuilder,
  PubkyAppUser,
  postUriBuilder,
  userUriBuilder,
  PubkyAppLastRead,
  baseUriBuilder,
  PubkyAppPostEmbed,
} from 'pubky-app-specs';

let client: Client;
if (TESTNET) {
  client = Client.testnet();
} else {
  client = new Client();
}

const homeserver = PublicKey.from(HOMESERVER_PUBLIC_KEY);

type PubkyClientContextType = {
  pubky: string | undefined;
  seed: string | undefined;
  setSeed: (seed: string | undefined) => void;
  mnemonic: string | undefined;
  setMnemonic: (mnemonic: string | undefined) => void;
  profile: PubkyAppUser | undefined;
  newUser: boolean;
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  generateAuthUrl: (
    caps?: string,
  ) => Promise<{ url: string; promise: any } | null>;
  loginWithFile: (password: string, recoveryFile: Buffer) => Promise<string>;
  loginWithAuthUrl: (publicKey: string) => Promise<string>;
  loginWithMnemonic: (mnemonic: string) => Promise<string>;
  isLoggedIn: () => Promise<boolean>;
  isSessionActive: () => Promise<boolean>;
  logout: () => boolean;
  signUp: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  saveProfile: (userProfile: PubkyAppUser) => Promise<PubkyAppUser | false>;
  createPost: (
    postContent: string,
    kind: PostKind,
    files?: File[],
    quote?: string,
  ) => Promise<{ uri: string; details: PubkyAppPost } | false>;
  editPost: (post: PostView, postContent: string) => Promise<string | false>;
  createArticle: (
    title: string,
    articleContent: string,
    kind: PostKind,
    files?: File[],
  ) => Promise<{ uri: string; details: PubkyAppPost } | false>;
  createRepost: (
    originalPostId: string,
    originalauthorId: string,
    repostContent: string,
    kind: PostKind,
    files?: File[],
  ) => Promise<string | false>;
  createReply: (
    originalPostUri: string,
    replyContent: string,
    kind: PostKind,
    files?: File[],
    quote?: string,
  ) => Promise<string | false>;
  follow: (user_id: string) => Promise<boolean>;
  unfollow: (user_id: string) => Promise<boolean>;
  deleteFile: (file_uri: string) => Promise<boolean>;
  mute: (user_id: string) => Promise<boolean>;
  unmute: (user_id: string) => Promise<boolean>;
  addBookmark: (postId: string, authorId: string) => Promise<boolean | string>;
  deleteBookmark: (
    postId: string,
    authorId: string,
    bookmarkId: string,
  ) => Promise<boolean>;
  createTag: (
    authorId: string,
    postId: string,
    label: string,
  ) => Promise<boolean>;
  deleteTag: (
    author_id: string,
    post_id: string,
    tagLabel: string,
  ) => Promise<boolean>;
  saveFeed: (feed: ICustomFeed, name: string) => Promise<boolean>;
  deleteFeed: (feed: ICustomFeed) => Promise<boolean>;
  loadFeeds: () => Promise<{ feed: ICustomFeed; name: string }[]>;
  createTagProfile: (userId: string, label: string) => Promise<boolean>;
  deleteTagProfile: (userId: string, label: string) => Promise<boolean>;
  getRecoveryFile: (password: string) => Promise<any | null>;
  storeProfile: (userProfile: UserDetails) => Promise<boolean>;
  updateStatus: (value: TStatus | string) => Promise<PubkyAppUser | undefined>;
  timeline: PostView[];
  setTimeline: React.Dispatch<React.SetStateAction<PostView[]>>;
  setSearchTags: (value: string[]) => any;
  searchTags: string[];
  repliesArray: PostView[] | undefined;
  setRepliesArray: (repliesArray: PostView[]) => void;
  timelineProfile: PostView[];
  setTimelineProfile: React.Dispatch<React.SetStateAction<PostView[]>>;
  deletePost: (post_id: string) => Promise<boolean>;
  deleteAccount: (
    setProgress: React.Dispatch<React.SetStateAction<number>>,
  ) => Promise<boolean>;
  downloadData: (
    setProgress: React.Dispatch<React.SetStateAction<number>>,
  ) => Promise<boolean>;
  importData: (
    zipFile: File,
    setProgress: React.Dispatch<React.SetStateAction<number>>,
  ) => Promise<boolean>;
  getTimestampNotification: () => Promise<number | boolean>;
  putTimestampNotification: (timestamp: number) => Promise<boolean>;
  loadSettings: () => Promise<{
    notifications: NotificationPreferences;
    privacysafety?: any;
    language?: string;
  } | null>;
  saveSettings: (
    notifications: NotificationPreferences,
    privacysafety?: any,
    language?: string,
  ) => Promise<boolean>;
  setReplies: React.Dispatch<React.SetStateAction<PostView[]>>;
  replies: PostView[];
  setMutedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  mutedUsers: string[] | undefined;
  timestamp: number;
  setTimestamp: React.Dispatch<React.SetStateAction<number>>;
  notificationPreferences: NotificationPreferences;
  setNotificationPreferences: React.Dispatch<
    React.SetStateAction<NotificationPreferences>
  >;
  newPosts: PostView[];
  setNewPosts: React.Dispatch<React.SetStateAction<PostView[]>>;
};

const PubkyClientContext = createContext({} as PubkyClientContextType);

export function PubkyClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [specsWasmLoaded, setSpecsWasmLoaded] = useState(false);
  const [pubky, setPubky] = useState<string | undefined>(
    (Utils.storage.get('pubky_public_key') as string) || undefined,
  );
  const [specsBuilder, setSpecsBuilder] = useState<
    PubkySpecsBuilder | undefined
  >(undefined);
  const [newUser, setNewUser] = useState(false);
  const [seed, setSeed] = useState<string | undefined>(
    (Utils.storage.get('seed') as string | undefined) || undefined,
  );
  const [mnemonic, setMnemonic] = useState<string | undefined>(
    (Utils.storage.get('mnemonic') as string | undefined) || undefined,
  );
  const [profile, setProfile] = useState<PubkyAppUser | undefined>(
    (Utils.storage.get('profile') as PubkyAppUser | undefined) || undefined,
  );
  const [mutedUsers, setMutedUsers] = useState<string[] | undefined>([]);
  const [timelineProfile, setTimelineProfile] = useState<PostView[]>([]);
  const [replies, setReplies] = useState<PostView[]>([]);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [repliesArray, setRepliesArray] = useState<PostView[]>(
    {} as PostView[],
  );
  const [timestamp, setTimestamp] = useState<number>(0);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreferences>({} as NotificationPreferences);
  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [timeline, setTimeline] = useState<PostView[]>([]);

  useEffect(() => {
    if (!specsWasmLoaded) {
      init()
        .then(() => setSpecsWasmLoaded(true))
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (specsWasmLoaded && pubky) {
      // We instantiate a new PubkySpecsBuilder when our user's pubky_id
      // changes so the URLs generated are always correct.
      setSpecsBuilder(new PubkySpecsBuilder(pubky));
    }
  }, [specsWasmLoaded, pubky]);

  if (!specsWasmLoaded) {
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
      Utils.storage.remove('feed');
      Utils.storage.remove('unread');

      setTimeout(() => {
        setProfile(undefined);
        setSeed(undefined);
        setMnemonic(undefined);
        setTimeline([]);
        setMutedUsers([]);
        setTimelineProfile([]);
        setReplies([]);
        setSearchTags([]);
        setPubky(undefined);
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const isSessionActive = async () => {
    try {
      if (pubky) {
        const publicKey = PublicKey.from(pubky);
        const session = await client.session(publicKey);
        if (session && pubky) return true;
      }

      return false;
    } catch (error) {
      console.error(error);
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

  const ensureReady = async (): Promise<void> => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      throw new Error('User is not logged in');
    }
    if (!specsBuilder) {
      throw new Error('Pubky App Specs Builder not yet ready');
    }
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

  const loginWithAuthUrl = async (publickey: string) => {
    try {
      // Save pubky state
      const pk = publickey;

      Utils.storage.set('pubky_public_key', pk);
      setPubky(pk);
      return pk;
    } catch (error: any) {
      // Get error message and return as a string
      console.log(error);
      throw new Error(error.message);
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

  const loginWithMnemonic = async (mnemonic: string) => {
    try {
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid recovery phrase');
      }
      const seedMnemonic = bip39.mnemonicToSeedSync(mnemonic);
      const secretKey = seedMnemonic.slice(0, 32);
      const keypair = Keypair.fromSecretKey(secretKey);

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

  const uploadFile = async (file: File): Promise<string> => {
    try {
      await ensureReady();

      // 1. Upload Blob
      const fileContent = await file.arrayBuffer();
      const blobData = new Uint8Array(fileContent);
      const blobResult = specsBuilder!.createBlob(blobData);

      await client.fetch(blobResult.meta.url, {
        method: 'PUT',
        body: blobResult.blob.data,
        credentials: 'include',
      });

      // 2. Create File Record
      const fileResult = specsBuilder!.createFile(
        file.name,
        blobResult.meta.url,
        file.type,
        BigInt(file.size),
      );

      await client.fetch(fileResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(fileResult.file.toJson()),
        credentials: 'include',
      });

      return fileResult.meta.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-throw to let caller handle
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map((file) => uploadFile(file)));
  };

  const signUp = async (userProfile: PubkyAppUser): Promise<any | false> => {
    try {
      const mnemonic = bip39.generateMnemonic(128);
      const seedMnemonic = bip39.mnemonicToSeedSync(mnemonic);
      const secretKey = seedMnemonic.slice(0, 32);
      const newKeypair = Keypair.fromSecretKey(secretKey);

      const seed = Utils.uint8ArrayToBase64(newKeypair.secretKey());

      // Sign up
      await client.signup(newKeypair, homeserver);

      // Get session
      const session = await client.session(newKeypair.publicKey());

      if (!session) {
        throw new Error('Failed to get session');
      }

      // Save pubky state
      const pk = session.pubky().z32();

      let file;
      if (userProfile.image instanceof File) {
        file = await uploadFile(userProfile.image);
      }

      setNewUser(true);

      // Save info in storage
      Utils.storage.set('seed', seed);
      setSeed(seed);

      Utils.storage.set('mnemonic', mnemonic);
      setMnemonic(mnemonic);

      Utils.storage.set('pubky_public_key', pk);
      setPubky(pk);

      // pubky id just changed, let's create a new SpecsBuilder
      const specsBuilder = new PubkySpecsBuilder(pk);
      setSpecsBuilder(specsBuilder);

      const result = specsBuilder.createUser(
        userProfile.name,
        userProfile.bio,
        file,
        userProfile.links,
        userProfile.status,
      );

      // Let's bring the full wasm object into JS and assign correct type.
      const user = result.user.toJson() as PubkyAppUser;

      Utils.storage.set('profile', JSON.stringify(user));
      setProfile(user);

      // Send the profile to the homeserver
      const response = await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(user),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return user;
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
    userProfile: PubkyAppUser,
  ): Promise<any | false> => {
    try {
      await ensureReady();

      let file;
      if (userProfile.image instanceof File) {
        file = await uploadFile(userProfile.image);
      }

      const userResult = specsBuilder!.createUser(
        userProfile.name,
        userProfile.bio,
        file,
        userProfile.links,
        userProfile.status,
      );

      const user = userResult.user.toJson() as PubkyAppUser;

      // Save the profile in storage
      Utils.storage.set('profile', JSON.stringify(user));
      setProfile(user);

      // Send the profile to the homeserver
      await client.fetch(userResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(user),
        credentials: 'include',
      });

      return user;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const updateStatus = async (newStatus: TStatus | string) => {
    try {
      if (!profile) throw new Error('Profile required');

      await ensureReady();

      const userResult = specsBuilder!.createUser(
        profile.name,
        profile.bio,
        profile.image,
        profile.links,
        newStatus,
      );

      const user = userResult.user.toJson() as PubkyAppUser;

      // Save the profile in storage
      Utils.storage.set('profile', JSON.stringify(user));
      setProfile(user);

      // Send the profile to the homeserver
      await client.fetch(userResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(user),
        credentials: 'include',
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (
    postContent: string,
    kind: PostKind,
    files?: File[],
    quote?: string,
  ): Promise<{ uri: string; details: PubkyAppPost } | false> => {
    try {
      const attachments = files ? await uploadFiles(files) : [];

      // Create post
      const postResult = specsBuilder!.createPost(
        postContent,
        kind,
        undefined, // parent
        quote ? { uri: quote, kind: 'short' } : undefined,
        attachments.length > 0 ? attachments : undefined,
      );

      const post = postResult.post.toJson() as PubkyAppPost;

      // Upload post
      await client.fetch(postResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(post),
        credentials: 'include',
      });

      // Mock up an instantaneous PostView to update UI
      const newPostDetails: PostDetails = {
        author: pubky!,
        id: postResult.meta.id,
        indexed_at: Date.now(),
        uri: postResult.meta.url,
        content: post.content,
        kind: post.kind,
      };

      const newPostView: PostView = {
        uri: postResult.meta.url,
        details: newPostDetails,
        counts: { replies: 0, reposts: 0, tags: 0 } as PostCounts,
        tags: [],
        cached: 'homeserver',
      } as PostView;

      setNewPosts((prev) => [newPostView, ...prev]);

      return { uri: postResult.meta.url, details: newPostDetails };
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const createArticle = async (
    title: string,
    articleContent: string,
    kind: PostKind,
    files?: File[],
  ): Promise<{ uri: string; details: PubkyAppPost } | false> => {
    try {
      await ensureReady();

      const attachments = files ? await uploadFiles(files) : [];

      const content = JSON.stringify({
        title: title,
        body: articleContent,
      });

      // Create post
      const postResult = specsBuilder!.createPost(
        content,
        kind,
        undefined, // parent
        undefined, // embed
        attachments.length > 0 ? attachments : undefined,
      );

      const post = postResult.post.toJson() as PubkyAppPost;

      // Send the post to the homeserver
      await client.fetch(postResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(post),
        credentials: 'include',
      });

      return { uri: postResult.meta.url, details: post };
    } catch (error) {
      console.error('Error creating article:', error);
      return false;
    }
  };

  const editPost = async (post: PostView, postContent: string) => {
    try {
      await ensureReady();

      const postResult = specsBuilder!.createPost(
        postContent,
        post?.details?.kind,
        post?.relationships?.replied,
        post?.relationships?.reposted
          ? { uri: post?.relationships?.reposted, kind: 'short' }
          : undefined,
        post?.details?.attachments,
      );

      // Send the post to the homeserver
      await client.fetch(postResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(postResult.post.toJson()),
        credentials: 'include',
      });

      return postResult.meta.url;
    } catch (error) {
      console.error('Error editing post:', error);
      return false;
    }
  };

  const deleteAccount = async (setProgress) => {
    try {
      await ensureReady();

      const baseDirectory = baseUriBuilder(pubky!);
      const dataList = await client.list(baseDirectory);

      // Separate profile.json and other files
      const profileUrl = `${baseDirectory}profile.json`;
      const filesToDelete = dataList.filter((file) => file !== profileUrl);

      // Sort remaining files alphanumerically (ascending order)
      filesToDelete.sort().reverse();

      // Total files including profile.json for progress calculation
      const totalFiles = filesToDelete.length + 1;

      // Delete each file (excluding profile.json) and update progress
      for (let index = 0; index < filesToDelete.length; index++) {
        await client.fetch(filesToDelete[index], {
          method: 'DELETE',
          credentials: 'include',
        });
        setProgress(Math.round(((index + 1) / totalFiles) * 100));
      }

      // Finally, delete profile.json and update progress to 100%
      await client.fetch(profileUrl, {
        method: 'DELETE',
        credentials: 'include',
      });
      setProgress(100);

      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  };

  const downloadData = async (setProgress: (val: number) => void) => {
    try {
      await ensureReady();

      const baseDirectory = baseUriBuilder(pubky!);
      let cursor: string | undefined = undefined;
      const dataList: string[] = [];
      const limit = 500;
      let hasMore = true;

      // 1) Gather the list of files from pubky
      do {
        const batch = await client.list(baseDirectory, cursor, false, limit);
        if (batch.length === 0) {
          hasMore = false;
        } else {
          dataList.push(...batch);
          cursor = batch[batch.length - 1];
        }
      } while (hasMore);

      // 2) Prepare a JSZip instance and create the 'data' folder
      const zip = new JSZip();
      const dataFolder = zip.folder('data');
      if (!dataFolder) {
        throw new Error("Error creating 'data' folder in zip.");
      }

      const totalFiles = dataList.length;

      // 3) Fetch each file as a Response, convert to ArrayBuffer, then decide if JSON or binary
      await Promise.all(
        dataList.map(async (dataUrl, index) => {
          // Get the Response object
          const response = await client.fetch(dataUrl);

          // Convert to ArrayBuffer
          const arrayBuffer = await response.arrayBuffer();

          // Derive a file name from the pubky URL
          const fileName = dataUrl.split(`pubky://${pubky}/`)[1];

          // Try to decode as JSON (text) — if it fails, store binary
          try {
            const decoder = new TextDecoder('utf-8');
            const decodedString = decoder.decode(arrayBuffer);
            const parsedData = JSON.parse(decodedString);
            dataFolder.file(fileName, JSON.stringify(parsedData, null, 2));
          } catch (err) {
            dataFolder.file(fileName, new Uint8Array(arrayBuffer), {
              binary: true,
            });
          }

          // Update progress
          setProgress(Math.round(((index + 1) / totalFiles) * 100));
        }),
      );

      const now = new Date();
      const formattedDateTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(
        now.getHours(),
      ).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(
        now.getSeconds(),
      ).padStart(2, '0')}`;

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pubky}_${formattedDateTime}_pubky.app.zip`;
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

  const importData = async (
    zipFile: File,
    setProgress: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    try {
      await ensureReady();

      // Load the zip file using JSZip
      const zip = await JSZip.loadAsync(zipFile);

      // Get all files in the zip
      const files = Object.keys(zip.files);

      // Extract files under 'data/' directory
      const dataFiles = files.filter((filename) =>
        filename.startsWith('data/'),
      );

      // Separate 'profile.json' and other files
      const profileFileName = 'pub/pubky.app/profile.json';
      const otherFiles = dataFiles.filter(
        (filename) => filename !== profileFileName,
      );

      // Sort other files in reverse alphanumeric order
      otherFiles.sort().reverse();

      // Combine 'profile.json' first, then the other files
      const allFiles = [profileFileName, ...otherFiles];

      const totalFiles = allFiles.length;

      // Process files one by one
      for (let index = 0; index < totalFiles; index++) {
        const filename = allFiles[index];
        const file = zip.files[filename];

        if (!file) {
          console.warn(`File ${filename} not found in the zip.`);
          continue;
        }

        // No need to upload directories
        if (file.dir) {
          continue;
        }

        // Read the file content as ArrayBuffer
        const content = await file.async('arraybuffer');

        // Prepare the destination URL for client.put()
        // Remove 'data/' prefix
        const dataUrl = `pubky://${pubky}/${filename.replace('data/', '')}`;

        // Upload the file
        await client.fetch(dataUrl, {
          method: 'PUT',
          body: new Uint8Array(content),
          credentials: 'include',
        });

        // Update progress
        setProgress(Math.round(((index + 1) / totalFiles) * 100));
        setProfile(undefined);
      }

      Utils.storage.remove('profile');
      setProfile(undefined);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const getTimestampNotification = async () => {
    try {
      await ensureReady();

      // create a new last_read only to craft the url
      const result = specsBuilder!.createLastRead();

      const response = await client.fetch(result.meta.url);
      const lastRead = (await response.json()) as PubkyAppLastRead;

      return Number(lastRead.timestamp);
    } catch (error) {
      // console.error('Error get timestamp:', error);
      return false;
    }
  };

  const putTimestampNotification = async (timestamp: number) => {
    try {
      await ensureReady();

      const result = specsBuilder!.createLastRead();

      await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(result.last_read.toJson()),
        credentials: 'include',
      });

      setTimestamp(timestamp);

      return true;
    } catch (error) {
      console.error('Error put timestamp:', error);
      return false;
    }
  };

  const loadSettings = async () => {
    try {
      if (!pubky) return null;

      await ensureReady();

      // pubky.app/settings is not covered by the specs!
      const settingsUrl = `pubky://${pubky}/pub/pubky.app/settings`;
      const response = await client.fetch(settingsUrl);
      const settings = await response.json();

      return settings;
    } catch (error) {
      console.error('Error load settings:', error);
      return null;
    }
  };

  const saveSettings = async (
    notifications: NotificationPreferences,
    privacysafety?: any,
    language?: string,
  ) => {
    try {
      await ensureReady();

      const settings = { notifications, privacysafety, language };

      const settingsUrl = `pubky://${pubky}/pub/pubky.app/settings`;

      await client.fetch(settingsUrl, {
        method: 'PUT',
        body: JSON.stringify(settings),
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error put settings:', error);
      return false;
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      await ensureReady();

      // Post URL
      const postUrl = postUriBuilder(pubky!, postId);

      // Send the post to the homeserver
      await client.fetch(postUrl, {
        method: 'DELETE',
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const generateAuthUrl = async (caps?: string) => {
    const capabilities =
      caps || '/pub/pubky.app/:rw,/pub/example.com/nested:rw';

    try {
      const [url, promise] = await client.authRequest(
        NEXT_PUBLIC_DEFAULT_HTTP_RELAY,
        capabilities,
      );
      return { url: String(url), promise };
    } catch (error) {
      console.error('Error generating auth URL:', error);
      return null;
    }
  };

  const createRepost = async (
    originalPostId: string,
    originalauthorId: string,
    repostContent: string,
    kind: PostKind,
    files?: File[],
  ): Promise<string | false> => {
    try {
      await ensureReady();

      const attachments = files ? await uploadFiles(files) : [];

      const repostedUri = postUriBuilder(originalauthorId, originalPostId);

      // Create post
      const postResult = specsBuilder!.createPost(
        repostContent,
        kind,
        undefined, // parent
        { uri: repostedUri, kind: 'short' },
        attachments.length > 0 ? attachments : undefined,
      );

      const post = postResult.post.toJson() as PubkyAppPost;

      await client.fetch(postResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(post),
        credentials: 'include',
      });

      return postResult.meta.url;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const createReply = async (
    originalPostUri: string,
    replyContent: string,
    kind: PostKind,
    files?: File[],
    quote?: string,
  ): Promise<string | false> => {
    try {
      await ensureReady();

      const attachments = files ? await uploadFiles(files) : [];

      // Create post
      const postResult = specsBuilder!.createPost(
        replyContent,
        kind,
        originalPostUri, // parent
        quote ? { uri: quote, kind: 'short' } : undefined,
        attachments.length > 0 ? attachments : undefined,
      );

      const post = postResult.post.toJson() as PubkyAppPost;

      await client.fetch(postResult.meta.url, {
        method: 'PUT',
        body: JSON.stringify(post),
        credentials: 'include',
      });

      return postResult.meta.url;
    } catch (error) {
      console.error('Error while replying to post:', error);
      return false;
    }
  };

  const follow = async (user_id: string): Promise<boolean> => {
    try {
      await ensureReady(); // ensure is logged in and specs are initialized

      const result = specsBuilder!.createFollow(user_id);

      const response = await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(result.follow.toJson()),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // get user relationships and check if it is followed
      // keep in a while loop until it is followed
      let userFollow = false;

      while (!userFollow) {
        try {
          const post = await getUserRelationship(user_id, pubky ?? '');
          if (post.following === true) {
            userFollow = true;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return true;
    } catch (error) {
      console.error('Error while following the user:', error);
      return false;
    }
  };

  const unfollow = async (user_id: string): Promise<boolean> => {
    try {
      await ensureReady();

      const result = specsBuilder!.createFollow(user_id);

      const response = await client.fetch(result.meta.url, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error('Error while unfollowing the user:', error);
      return false;
    }
  };

  const deleteFile = async (file_uri: string): Promise<boolean> => {
    try {
      await ensureReady();

      await client.fetch(file_uri, {
        method: 'DELETE',
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error while unfollowing the user:', error);
      return false;
    }
  };

  const mute = async (user_id: string): Promise<boolean> => {
    try {
      await ensureReady();

      const result = specsBuilder!.createMute(user_id);

      await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(result.mute.toJson()),
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error while muting the user:', error);
      return false;
    }
  };

  const unmute = async (user_id: string): Promise<boolean> => {
    try {
      await ensureReady();

      const result = specsBuilder!.createMute(user_id);

      await client.fetch(result.meta.url, {
        method: 'DELETE',
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error while unmuting the user:', error);
      return false;
    }
  };

  const addBookmark = async (
    postId: string,
    authorId: string,
  ): Promise<boolean | string> => {
    try {
      await ensureReady();

      const uriPost = postUriBuilder(authorId, postId);
      const result = specsBuilder!.createBookmark(uriPost);

      const response = await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(result.bookmark.toJson()),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return result.meta.id;
    } catch (error) {
      console.error('Error while bookmarking the post:', error);
      return false;
    }
  };

  const deleteBookmark = async (
    postId: string,
    authorId: string,
    bookmarkId: string,
  ): Promise<boolean> => {
    try {
      await ensureReady();

      const uriPost = postUriBuilder(authorId, postId);
      const result = specsBuilder!.createBookmark(uriPost);

      const response = await client.fetch(result.meta.url, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error('Error while undo bookmark the post:', error);
      return false;
    }
  };

  const createTag = async (
    authorId: string,
    postId: string,
    label: string,
  ): Promise<boolean> => {
    try {
      await ensureReady();

      const postUri = postUriBuilder(authorId, postId);
      const result = specsBuilder!.createTag(postUri, label);

      await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(result.tag.toJson()),
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const saveFeed = async (
    feed: ICustomFeed,
    name: string,
  ): Promise<boolean> => {
    try {
      await ensureReady();

      // Map the ICustomFeed to the arguments for `createFeed`:
      // feed might have e.g. tags, reach, layout, etc.
      const { tags, reach, layout, sort, content } = feed;

      // If feed.tags is null, pass null. Otherwise pass as is.
      const tagsValue = tags && tags.length > 0 ? tags : null;
      const contentVal = content == 'all' ? null : content;

      const result = specsBuilder!.createFeed(
        tagsValue,
        reach,
        layout,
        sort,
        contentVal || null,
        name,
      );

      const feedObj = result.feed.toJson();
      await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(feedObj),
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error creating feed:', error);
      return false;
    }
  };

  const loadFeeds = async (): Promise<
    { feed: ICustomFeed; name: string }[]
  > => {
    try {
      await ensureReady();

      // Define the feeds directory path
      const feedsDirUrl = `pubky://${pubky}/pub/pubky.app/feeds/`;
      const feedUris = await client.list(feedsDirUrl);

      // Fetch each feed data
      const feedsData = await Promise.all(
        feedUris.map(async (uri) => {
          try {
            const response = await client.fetch(uri);
            const feed = await response.json();
            return feed;
          } catch (error) {
            console.error(`Error fetching feed from ${uri}:`, error);
            return null;
          }
        }),
      );

      // Filter out any null entries and assert the result type
      return feedsData.filter(
        (feed): feed is { feed: ICustomFeed; name: string } => feed !== null,
      );
    } catch (error) {
      console.error('Error loading feeds:', error);
      return [];
    }
  };

  const deleteFeed = async (feed: ICustomFeed): Promise<boolean> => {
    try {
      await ensureReady();

      // Map the ICustomFeed to the arguments for `createFeed`:
      // feed might have e.g. tags, reach, layout, etc.
      const { tags, reach, layout, sort, content } = feed;

      // If feed.tags is null, pass null. Otherwise pass as is.
      const tagsValue = tags && tags.length > 0 ? tags : null;
      const contentVal = content == 'all' ? null : content;

      // create feed according to specs to compute ID and URL
      const result = specsBuilder!.createFeed(
        tagsValue,
        reach,
        layout,
        sort,
        contentVal || null,
        'placeholder',
      );

      // Delete the feed from the homeserver
      await client.fetch(result.meta.url, {
        method: 'DELETE',
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error deleting feed:', error);
      return false;
    }
  };

  const deleteTag = async (
    authorId: string,
    postId: string,
    tagLabel: string,
  ): Promise<boolean> => {
    try {
      await ensureReady();

      // Compute tag URL and ID based on tag object content using the builder
      const uriPost = postUriBuilder(authorId, postId);
      const result = specsBuilder!.createTag(uriPost, tagLabel);

      await client.fetch(result.meta.url, {
        method: 'DELETE',
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    }
  };

  const createTagProfile = async (
    userId: string,
    label: string,
  ): Promise<boolean> => {
    try {
      await ensureReady();

      const uriProfile = userUriBuilder(userId);
      const result = specsBuilder!.createTag(uriProfile, label);

      await client.fetch(result.meta.url, {
        method: 'PUT',
        body: JSON.stringify(result.tag.toJson()),
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  const deleteTagProfile = async (
    userId: string,
    label: string,
  ): Promise<boolean> => {
    try {
      await ensureReady();

      const uriProfile = userUriBuilder(userId);

      // Compute ID and URL for a from its content (unique)
      const result = specsBuilder!.createTag(uriProfile, label);

      await client.fetch(result.meta.url, {
        method: 'DELETE',
        credentials: 'include',
      });

      return true;
    } catch (error) {
      console.error('Error creating tag:', error);
      return false;
    }
  };

  return (
    <PubkyClientContext.Provider
      value={{
        newPosts,
        setNewPosts,
        replies,
        setReplies,
        newUser,
        setNewUser,
        pubky,
        seed,
        profile,
        mnemonic,
        generateAuthUrl,
        loginWithFile,
        loginWithMnemonic,
        loginWithAuthUrl,
        isLoggedIn,
        isSessionActive,
        logout,
        signUp,
        setSeed,
        setMnemonic,
        saveProfile,
        saveFeed,
        deleteFeed,
        loadFeeds,
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
        saveSettings,
        loadSettings,
        downloadData,
        importData,
        mutedUsers,
        setMutedUsers,
        timestamp,
        setTimestamp,
        notificationPreferences,
        setNotificationPreferences,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PubkyClientContext.Provider>
  );
}

export function usePubkyClientContext() {
  return useContext(PubkyClientContext);
}
