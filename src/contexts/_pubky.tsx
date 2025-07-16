'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { Client, PublicKey, decryptRecoveryFile, Keypair, createRecoveryFile } from '@synonymdev/pubky';
import { Utils } from '@social/utils-shared';
import { PostCounts, PostDetails, PostView } from '@/types/Post';
import { ICustomFeed, NotificationPreferences, TStatus } from '@/types';
import JSZip from 'jszip';
import * as bip39 from 'bip39';
import init, {
  PubkySpecsBuilder,
  PubkyAppUser,
  postUriBuilder,
  userUriBuilder,
  PubkyAppLastRead,
  baseUriBuilder,
  PubkyAppPostKind,
  PubkyAppPost,
  PubkyAppPostEmbed,
  PubkyAppUserLink
} from 'pubky-app-specs';
import { defaultPreferences } from './_filters';
import { userProfileCache } from '@/components/utils-shared/lib/Helper/userProfileCache';
import { clearUserProfileCache, clearUserRelationshipCache } from '@/services/userService';

const TESTNET = process.env.NEXT_PUBLIC_TESTNET?.toLowerCase() === 'true';
const NEXT_PUBLIC_DEFAULT_HTTP_RELAY = process.env.NEXT_PUBLIC_DEFAULT_HTTP_RELAY || 'https://demo.httprelay.io/link/';
const NEXT_PUBLIC_PKARR_RELAYS = process.env.NEXT_PUBLIC_PKARR_RELAYS
  ? JSON.parse(process.env.NEXT_PUBLIC_PKARR_RELAYS)
  : ['https://pkarr.pubky.app', 'https://pkarr.pubky.org'];

const client = TESTNET
  ? Client.testnet()
  : new Client({
      pkarr: {
        relays: NEXT_PUBLIC_PKARR_RELAYS,
        requestTimeout: null
      },
      userMaxRecordAge: null
    });
const NEXT_PUBLIC_HOMESERVER = PublicKey.from(process.env.NEXT_PUBLIC_HOMESERVER);

const contentTypeMap = {
  posts: 'short',
  articles: 'long',
  images: 'image',
  videos: 'video',
  links: 'link',
  files: 'file',
  all: null
};

type PubkyClientContextType = {
  pubky: string | undefined;
  seed: string | undefined;
  setSeed: (seed: string | undefined) => void;
  mnemonic: string | undefined;
  setMnemonic: (mnemonic: string | undefined) => void;
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
  profile: PubkyAppUser | undefined;
  newUser: boolean;
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  generateAuthUrl: (caps?: string) => Promise<{ url: string; promise: any } | null>;
  loginWithFile: (password: string, recoveryFile: Buffer) => Promise<string>;
  loginWithAuthUrl: (publicKey: PublicKey) => Promise<string>;
  loginWithMnemonic: (mnemonic: string) => Promise<string>;
  isLoggedIn: () => Promise<boolean>;
  isSessionActive: () => Promise<{ status: boolean; message: string }>;
  logout: () => boolean;
  signUp: (
    name: string,
    token: string,
    bio?: string,
    links?: PubkyAppUserLink[],
    image?: File | string
  ) => Promise<PubkyAppUser | { state: false; error: any }>;
  saveProfile: (
    name: string,
    bio?: string,
    image?: File | string,
    links?: PubkyAppUserLink[],
    status?: string
  ) => Promise<PubkyAppUser | false>;
  createPost: (
    postContent: string,
    kind: PubkyAppPostKind,
    files?: File[],
    quote?: string,
    tags?: string[]
  ) => Promise<{ uri: string; details: PubkyAppPost } | false>;
  editPost: (postId: string, newContent: string) => Promise<string | false>;
  createArticle: (
    title: string,
    articleContent: string,
    files?: File[],
    tags?: string[]
  ) => Promise<{ uri: string; details: PubkyAppPost } | false>;
  editArticle: (postId: string, title: string, articleContent: string, tags?: string[]) => Promise<string | false>;
  createRepost: (
    originalPostId: string,
    originalauthorId: string,
    repostContent: string,
    kind: PubkyAppPostKind,
    files?: File[]
  ) => Promise<string | false>;
  createReply: (
    originalPostUri: string,
    replyContent: string,
    kind: PubkyAppPostKind,
    files?: File[],
    quote?: string,
    tags?: string[],
    isNestedReply?: boolean
  ) => Promise<string | false>;
  follow: (user_id: string) => Promise<boolean>;
  unfollow: (user_id: string) => Promise<boolean>;
  deleteFile: (file_uri: string) => Promise<boolean>;
  mute: (user_id: string) => Promise<boolean>;
  unmute: (user_id: string) => Promise<boolean>;
  addBookmark: (postId: string, authorId: string) => Promise<boolean | string>;
  deleteBookmark: (postId: string, authorId: string) => Promise<boolean>;
  createTag: (authorId: string, postId: string, label: string) => Promise<boolean>;
  deleteTag: (author_id: string, post_id: string, tagLabel: string) => Promise<boolean>;
  saveFeed: (feed: ICustomFeed, name: string) => Promise<boolean>;
  deleteFeed: (feed: ICustomFeed) => Promise<boolean>;
  loadFeeds: () => Promise<{ feed: ICustomFeed; name: string }[]>;
  createTagProfile: (userId: string, label: string) => Promise<boolean>;
  deleteTagProfile: (userId: string, label: string) => Promise<boolean>;
  getRecoveryFile: (password: string) => Promise<any | null>;
  storeProfile: (userProfile: PubkyAppUser) => Promise<boolean>;
  updateStatus: (value: TStatus | string) => Promise<PubkyAppUser | undefined>;
  timeline: PostView[];
  setTimeline: React.Dispatch<React.SetStateAction<PostView[]>>;
  setSearchTags: (value: string[]) => any;
  searchTags: string[];
  repliesArray: PostView[] | undefined;
  setRepliesArray: (repliesArray: PostView[]) => void;
  timelineProfile: PostView[];
  setTimelineProfile: React.Dispatch<React.SetStateAction<PostView[]>>;
  deletePost: (post: PostView) => Promise<boolean>;
  deleteAccount: (setProgress: React.Dispatch<React.SetStateAction<number>>) => Promise<boolean>;
  downloadData: (setProgress: React.Dispatch<React.SetStateAction<number>>) => Promise<boolean>;
  importData: (zipFile: File, setProgress: React.Dispatch<React.SetStateAction<number>>) => Promise<boolean>;
  getTimestampNotification: () => Promise<number>;
  putTimestampNotification: () => Promise<boolean>;
  loadSettings: () => Promise<{
    notifications: NotificationPreferences;
    privacysafety?: any;
    language?: string;
  } | null>;
  saveSettings: (notifications: NotificationPreferences, privacysafety?: any, language?: string) => Promise<boolean>;
  setReplies: React.Dispatch<React.SetStateAction<PostView[]>>;
  replies: PostView[];
  setMutedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  mutedUsers: string[] | undefined;
  timestamp: number;
  setTimestamp: React.Dispatch<React.SetStateAction<number>>;
  newPosts: PostView[];
  setNewPosts: React.Dispatch<React.SetStateAction<PostView[]>>;
  deletedPosts: string[];
  singlePost: PostView | undefined;
  setSinglePost: React.Dispatch<React.SetStateAction<PostView | undefined>>;
  updateFeed: (originalFeed: ICustomFeed, updatedFeed: ICustomFeed, name: string) => Promise<boolean>;
};

const PubkyClientContext = createContext({} as PubkyClientContextType);

export function PubkyClientWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [specsWasmLoaded, setSpecsWasmLoaded] = useState(false);
  const [pubky, setPubky] = useState<string | undefined>(
    (Utils.storage.get('pubky_public_key') as string) || undefined
  );
  const [specsBuilder, setSpecsBuilder] = useState<PubkySpecsBuilder | undefined>(undefined);
  const [newUser, setNewUser] = useState(false);
  const [seed, setSeed] = useState<string | undefined>((Utils.storage.get('seed') as string | undefined) || undefined);
  const [isOnline, setIsOnline] = useState(true);
  const [mnemonic, setMnemonic] = useState<string | undefined>(
    (Utils.storage.get('mnemonic') as string | undefined) || undefined
  );
  const [profile, setProfile] = useState<PubkyAppUser | undefined>(
    (Utils.storage.get('profile') as PubkyAppUser | undefined) || undefined
  );
  const [mutedUsers, setMutedUsers] = useState<string[] | undefined>([]);
  const [timelineProfile, setTimelineProfile] = useState<PostView[]>([]);
  const [replies, setReplies] = useState<PostView[]>([]);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [repliesArray, setRepliesArray] = useState<PostView[]>({} as PostView[]);
  const [timestamp, setTimestamp] = useState<number>(0);
  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [deletedPosts, setDeletedPosts] = useState<string[]>([]);
  const [singlePost, setSinglePost] = useState<PostView | undefined>(undefined);

  useEffect(() => {
    init()
      .then(() => setSpecsWasmLoaded(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // On first time new user we save `/settings
    if (newUser) {
      saveSettings(defaultPreferences);
    }
  }, [newUser]);

  useEffect(() => {
    specsWasmLoaded && pubky && setSpecsBuilder(new PubkySpecsBuilder(pubky));
  }, [specsWasmLoaded, pubky]);

  if (!specsWasmLoaded) {
    return <div>Loading...</div>;
  }

  const handleError = (error: unknown, context: string) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${context}] ${message}`);
    return false;
  };

  const withAuth = <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R> => {
      try {
        await ensureReady();
        return await fn(...args);
      } catch (error) {
        handleError(error, fn.name);
        throw error;
      }
    };
  };

  const ensureReady = async (): Promise<void> => {
    if (!(await isLoggedIn())) throw new Error('User not logged in');
    if (!specsBuilder) throw new Error('Pubky App Specs Builder not ready');
  };

  const setPubkyAndStorage = (pk: string) => {
    Utils.storage.set('pubky_public_key', pk);
    setPubky(pk);
  };

  const homeserver = {
    get: (url: string) => client.fetch(url),
    put: (url: string, body: any) => client.fetch(url, { method: 'PUT', body, credentials: 'include' }),
    del: (url: string) => client.fetch(url, { method: 'DELETE', credentials: 'include' })
  };

  const logout = () => {
    try {
      pubky && client.signout(PublicKey.from(pubky));

      // Clear storage and states
      [
        'pubky_public_key',
        'seed',
        'mnemonic',
        'profile',
        'timerRemind',
        'backup',
        'feed',
        'unread',
        'searchHistory',
        'unblurred_posts',
        'unblurred_images',
        'emoji-mart.frequently',
        'emoji-mart.last'
      ].forEach(Utils.storage.remove);

      setTimeout(() => {
        setProfile(undefined);
        setSeed(undefined);
        setMnemonic(undefined);
        setTimeline([]);
        setNewPosts([]);
        setMutedUsers([]);
        setTimelineProfile([]);
        setReplies([]);
        setSearchTags([]);
        setPubky(undefined);
        setSpecsBuilder(undefined);
        clearUserProfileCache();
        clearUserRelationshipCache();
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const isSessionActive = async () => {
    try {
      const currentPubky = pubky || Utils.storage.get('pubky_public_key');
      if (!currentPubky) return { status: false, message: 'User not logged in or pubky key not found' };

      const publicKey = PublicKey.from(currentPubky as string);
      const session = await client.session(publicKey);

      if (!session) {
        return { status: false, message: 'Session expired' };
      }

      return { status: true, message: 'Ok', session };
    } catch (error) {
      console.log('Session check failed:', error);
      if (String(error) === 'error sending request' && typeof window !== 'undefined' && !navigator.onLine) {
        return { status: true, message: 'connection lost' };
      }
      return { status: true, message: 'homeserver down' };
    }
  };

  const isLoggedIn = async () => {
    // TODO: Temporary fix — this should eventually be replaced with middleware
    // More info in https://github.com/pubky/pubky-app/pull/1235
    if (!pubky && !Utils.storage.get('pubky_public_key')) {
      console.log('Removing pubky context and localStorage...');
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

  async function checkHomeserver(publicKey: PublicKey): Promise<string> {
    const homeserver = await client.getHomeserver(publicKey);

    if (homeserver.z32() !== NEXT_PUBLIC_HOMESERVER.z32()) {
      console.error('Authentication failed: Wrong homeserver');
      throw new Error('Authentication failed: Wrong homeserver');
    }
    return publicKey.z32();
  }

  const loginWithAuthUrl = async (publickey: PublicKey) => {
    try {
      // check homeserver
      const homeserver = await checkHomeserver(publickey);
      if (!homeserver) logout();
      // Save pubky state
      const pk = publickey.z32();

      setPubkyAndStorage(pk);
      return pk;
    } catch (error: any) {
      // Get error message and return as a string
      console.error(error);
      throw new Error(error);
    }
  };

  // Helper used on the different login methods
  async function authenticateKeypair(keypair: Keypair): Promise<string> {
    try {
      // check homeserver
      await checkHomeserver(keypair.publicKey());

      // 1) Sign in with the Keypair
      await client.signin(keypair);
    } catch (error) {
      console.warn('Sign in failed:', error);
      try {
        // 1.1) Try republishHomeserver with the Keypair
        await client.republishHomeserver(keypair, NEXT_PUBLIC_HOMESERVER);
      } catch (error) {
        console.error(error);
        throw new Error('Authentication failed: unable to sign in');
      }
    }

    // 2) Retrieve the session
    const session = await client.session(keypair.publicKey());
    if (!session) {
      throw new Error('Failed to get session');
    }

    // 3) Derive the public key in z32 form
    const pk = session.pubky().z32();

    // 4) Persist the pk to state and storage
    setPubkyAndStorage(pk);
    setSpecsBuilder(new PubkySpecsBuilder(pk));

    return pk;
  }

  const loginWithFile = async (password: string, recoveryFile: Buffer) => {
    try {
      const keypair = decryptRecoveryFile(recoveryFile, password);

      if (!keypair) {
        throw new Error('Invalid recovery file');
      }

      return await authenticateKeypair(keypair);
    } catch (error: any) {
      // Get error message and return as a string
      console.error(error);
      throw new Error(error);
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

      return await authenticateKeypair(keypair);
    } catch (error: any) {
      // Get error message and return as a string
      console.error(error);
      throw new Error(error);
    }
  };

  const handleHomeserverResponse = async (response: Response): Promise<void> => {
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error('Session expired');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const uploadFile = async (file: File, specsB?: PubkySpecsBuilder): Promise<string> => {
    let specs = specsB ? specsB : specsBuilder;

    // 1. Upload Blob
    const fileContent = await file.arrayBuffer();
    const blobData = new Uint8Array(fileContent);
    const blobResult = specs!.createBlob(blobData);

    const blobResponse = await homeserver.put(blobResult.meta.url, blobResult.blob.data);
    await handleHomeserverResponse(blobResponse);

    // 2. Create File Record
    const fileResult = specs!.createFile(file.name, blobResult.meta.url, file.type, file.size);

    const fileResponse = await homeserver.put(fileResult.meta.url, JSON.stringify(fileResult.file.toJson()));
    await handleHomeserverResponse(fileResponse);

    return fileResult.meta.url;
  };

  const uploadFileWithAuth = withAuth(async (file: File, specsB?: PubkySpecsBuilder): Promise<string> => {
    return await uploadFile(file, specsB);
  });

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map((file) => uploadFileWithAuth(file)));
  };

  const signUp = async (
    name: string,
    token: string,
    bio?: string,
    links?: PubkyAppUserLink[],
    image?: File | string
  ): Promise<PubkyAppUser | { state: false; error: any }> => {
    try {
      const mnemonic = bip39.generateMnemonic(128);
      const seedMnemonic = bip39.mnemonicToSeedSync(mnemonic);
      const secretKey = seedMnemonic.slice(0, 32);
      const newKeypair = Keypair.fromSecretKey(secretKey);
      const seed = Utils.uint8ArrayToBase64(newKeypair.secretKey());

      // Sign up
      await client.signup(newKeypair, NEXT_PUBLIC_HOMESERVER, token);

      // Get session
      const session = await client.session(newKeypair.publicKey());

      if (!session) {
        throw new Error('Failed to get session');
      }

      // New pubky id
      const pk = session.pubky().z32();

      // pubky id just changed, let's create a new SpecsBuilder
      const specsBuilder = new PubkySpecsBuilder(pk);
      setSpecsBuilder(specsBuilder);

      // Upload avatar without ensuring auth (because state has not yet updated)
      let file: string | undefined;
      if (image instanceof File) {
        // Upload avatar
        const uploadResult = await uploadFile(image, specsBuilder);
        file = uploadResult ? uploadResult : undefined;
      } else {
        file = image;
      }

      const result = specsBuilder.createUser(name || 'anonymous', bio, file, links);

      // Let's bring the full wasm object into JS and assign correct type.
      const user = result.user.toJson() as PubkyAppUser;

      // Send the profile to the homeserver
      const response = await homeserver.put(result.meta.url, JSON.stringify(user));

      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Save new state
      setPubkyAndStorage(pk);
      setNewUser(true);
      // Save info in storage
      Utils.storage.set('seed', seed);
      setSeed(seed);
      Utils.storage.set('mnemonic', mnemonic);
      setMnemonic(mnemonic);
      await storeProfile(user);

      return user;
    } catch (error) {
      console.log(error);
      return {
        state: false,
        error
      };
    }
  };

  const storeProfile = async (user: PubkyAppUser): Promise<boolean> => {
    // Save the profile in storage
    Utils.storage.set('profile', JSON.stringify(user));
    setProfile(user);

    return true;
  };

  const saveProfile = withAuth(
    async (
      name: string,
      bio?: string,
      image?: File | string,
      links?: PubkyAppUserLink[],
      status?: string
    ): Promise<any | false> => {
      let file: string | undefined;
      if (image instanceof File) {
        // Upload avatar
        const uploadResult = await uploadFileWithAuth(image);
        file = uploadResult ? uploadResult : undefined;
      } else {
        file = image;
      }

      const userResult = specsBuilder!.createUser(name || 'anonymous', bio, file, links, status);

      const user = userResult.user.toJson() as PubkyAppUser;

      // Save the profile in storage
      await storeProfile(user);

      // Send the profile to the homeserver
      const response = await homeserver.put(userResult.meta.url, JSON.stringify(user));
      await handleHomeserverResponse(response);

      return user;
    }
  );

  const updateStatus = withAuth(async (newStatus: TStatus | string) => {
    if (!profile) throw new Error('Profile required');

    const userResult = specsBuilder!.createUser(profile.name, profile.bio, profile.image, profile.links, newStatus);

    const user = userResult.user.toJson() as PubkyAppUser;

    // Save the profile in storage
    await storeProfile(user);

    // Send the profile to the homeserver
    const response = await homeserver.put(userResult.meta.url, JSON.stringify(user));
    await handleHomeserverResponse(response);

    return user;
  });

  const createBasePost = async (
    content: string,
    kind: PubkyAppPostKind,
    parentUri?: string,
    embedUri?: string,
    files?: File[],
    tags?: string[]
  ): Promise<{ uri: string; id: string; details: PubkyAppPost } | false> => {
    try {
      const attachments = (files?.length || 0) > 0 ? await uploadFiles(files!) : undefined;

      let embed;
      if (embedUri) {
        embed = new PubkyAppPostEmbed(embedUri, PubkyAppPostKind.Short);
      }

      const postResult = specsBuilder!.createPost(content, kind, parentUri, embed, attachments);

      const post = postResult.post.toJson() as PubkyAppPost;
      const response = await homeserver.put(postResult.meta.url, JSON.stringify(post));
      await handleHomeserverResponse(response);

      // Create tags before returning the result
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          try {
            await createTag(pubky!, postResult.meta.id, tag);
          } catch (error) {
            console.error(`Error creating tag ${tag}:`, error);
          }
        }
      }

      return {
        uri: postResult.meta.url,
        id: postResult.meta.id,
        details: post
      };
    } catch (error) {
      handleError(error, 'createBasePost');
      return false;
    }
  };

  // Refactored functions using createBasePost
  const createPost = withAuth(
    async (
      postContent: string,
      kind: PubkyAppPostKind,
      files?: File[],
      quote?: string,
      tags?: string[]
    ): Promise<{ uri: string; details: PubkyAppPost } | false> => {
      const result = await createBasePost(
        postContent,
        kind,
        undefined, // parentUri
        quote,
        files,
        tags
      );

      if (!result) return false;

      const skeletonAttachments = files?.map((file) => {
        if (file.type.startsWith('image/')) {
          return '/images/skeleton-image.svg';
        }
        return '';
      });

      const newPostDetails: PostDetails = {
        author: pubky!,
        id: result.id,
        indexed_at: Date.now(),
        uri: result.uri,
        content: result.details.content,
        kind: result.details.kind,
        attachments: skeletonAttachments
      };

      const newPostView: PostView = {
        uri: result.uri,
        details: newPostDetails,
        counts: {
          replies: 0,
          reposts: 0,
          tags: tags?.length || 0
        } as PostCounts,
        tags:
          tags && tags.length > 0
            ? tags.map((tag) => ({
                label: tag,
                taggers: [pubky],
                taggers_count: 1,
                relationship: true
              }))
            : [],
        cached: 'homeserver'
      } as PostView;

      setNewPosts((prev) => [newPostView, ...prev]);
      setTimeline((prev) => [newPostView, ...prev]);

      return { uri: result.uri, details: result.details };
    }
  );

  const createArticle = withAuth(
    async (
      title: string,
      articleContent: string,
      files?: File[],
      tags?: string[]
    ): Promise<{ uri: string; details: PubkyAppPost } | false> => {
      const content = JSON.stringify({ title, body: articleContent });
      const result = await createBasePost(content, PubkyAppPostKind.Long, undefined, undefined, files, tags);

      if (!result) return false;

      const skeletonAttachments = files?.map((file) => {
        if (file.type.startsWith('image/')) {
          return '/images/skeleton-image.svg';
        }
        return '';
      });

      const newPostDetails: PostDetails = {
        author: pubky!,
        id: result.id,
        indexed_at: Date.now(),
        uri: result.uri,
        content: result.details.content,
        kind: result.details.kind,
        attachments: skeletonAttachments
      };

      const newPostView: PostView = {
        uri: result.uri,
        details: newPostDetails,
        counts: {
          replies: 0,
          reposts: 0,
          tags: tags?.length || 0
        } as PostCounts,
        tags:
          tags && tags.length > 0
            ? tags.map((tag) => ({
                label: tag,
                taggers: [pubky],
                taggers_count: 1,
                relationship: true
              }))
            : [],
        cached: 'homeserver'
      } as PostView;

      setNewPosts((prev) => [newPostView, ...prev]);
      setTimeline((prev) => [newPostView, ...prev]);

      return result ? { uri: result.uri, details: result.details } : false;
    }
  );

  const editArticle = withAuth(
    async (postId: string, title: string, articleContent: string, tags?: string[]): Promise<string | false> => {
      const content = JSON.stringify({ title, body: articleContent });

      // optimistic edit post in the timeline
      setTimeline((prevTimeline) =>
        prevTimeline.map((p) => {
          if (p.details.id === postId) {
            return {
              ...p,
              details: { ...p.details, content },
              tags: tags
                ? tags.map((tag) => ({
                    label: tag,
                    taggers: [pubky!],
                    taggers_count: 1,
                    relationship: true
                  }))
                : p.tags,
              counts: {
                ...p.counts,
                tags: tags?.length || 0
              }
            };
          }
          return p;
        })
      );

      // optimistic edit post in the replies
      setReplies((prevReplies) =>
        prevReplies.map((p) => {
          if (p.details.id === postId) {
            return {
              ...p,
              details: { ...p.details, content },
              tags: tags
                ? tags.map((tag) => ({
                    label: tag,
                    taggers: [pubky!],
                    taggers_count: 1,
                    relationship: true
                  }))
                : p.tags,
              counts: {
                ...p.counts,
                tags: tags?.length || 0
              }
            };
          }
          return p;
        })
      );

      // Fetch the existing post from the homeserver
      let postUri = postUriBuilder(pubky!, postId);
      const response = await homeserver.get(postUri);
      const originalPost = PubkyAppPost.fromJson(await response.json());

      // Use specs to edit the existing post and store in homeserver
      const result = specsBuilder!.editPost(originalPost, postId, content);
      const updatedPost = { ...result.post.toJson() };
      const updateResponse = await homeserver.put(result.meta.url, JSON.stringify(updatedPost));
      await handleHomeserverResponse(updateResponse);

      // Update tags
      if (tags) {
        for (const tag of tags) {
          await createTag(pubky!, postId, tag);
        }
      }

      return result.meta.url;
    }
  );

  const createRepost = withAuth(
    async (
      originalPostId: string,
      originalauthorId: string,
      repostContent: string,
      kind: PubkyAppPostKind,
      files?: File[],
      tags?: string[]
    ): Promise<string | false> => {
      const repostedUri = postUriBuilder(originalauthorId, originalPostId);
      const result = await createBasePost(repostContent, kind, undefined, repostedUri, files, tags);

      if (!result) return false;

      const newRepostDetails: PostDetails = {
        author: pubky!,
        id: result.id,
        indexed_at: Date.now(),
        uri: result.uri,
        content: repostContent,
        kind: result.details.kind
      };

      const newRepostView: PostView = {
        details: newRepostDetails,
        counts: { replies: 0, reposts: 0, tags: 0 } as PostCounts,
        tags: [],
        cached: 'homeserver',
        relationships: {
          reposted: `pubky://${originalauthorId}/pub/pubky.app/posts/${originalPostId}` // Colleghiamo il repost al post originale
        }
      };

      setNewPosts((prev) => [newRepostView, ...prev]);
      setTimeline((prev) => [newRepostView, ...prev]);
      return result.uri;
    }
  );

  const createReply = withAuth(
    async (
      originalPostUri: string,
      replyContent: string,
      kind: PubkyAppPostKind,
      files?: File[],
      quote?: string,
      tags?: string[],
      isNestedReply?: boolean
    ): Promise<string | false> => {
      const result = await createBasePost(replyContent, kind, originalPostUri, quote, files, tags);

      if (!result) return false;

      const skeletonAttachments = files?.map((file) => {
        if (file.type.startsWith('image/')) {
          return '/images/skeleton-image.svg';
        }
        return '';
      });

      const newReplyDetails: PostDetails = {
        author: pubky!,
        id: result.id,
        indexed_at: Date.now(),
        uri: result.uri,
        content: replyContent,
        kind: result.details.kind,
        attachments: skeletonAttachments
      };

      const newReplyView: PostView = {
        details: newReplyDetails,
        counts: { replies: 0, reposts: 0, tags: 0 } as PostCounts,
        tags: [],
        cached: 'homeserver'
      } as PostView;

      // Only add to replies list if it's not a nested reply
      if (!isNestedReply) {
        setReplies((prev) => [newReplyView, ...prev]);
      }

      return result ? result.uri : false;
    }
  );

  const editPost = withAuth(async (postId: string, newContent: string) => {
    // optimistic edit post in the timeline
    setTimeline((prevTimeline) =>
      prevTimeline.map((p) => (p.details.id === postId ? { ...p, details: { ...p.details, content: newContent } } : p))
    );

    // optimistic edit post in the replies
    setReplies((prevReplies) =>
      prevReplies.map((p) => (p.details.id === postId ? { ...p, details: { ...p.details, content: newContent } } : p))
    );

    // Fetch the existing post from the homeserver
    let postUri = postUriBuilder(pubky!, postId);
    const response = await homeserver.get(postUri);
    const originalPost = PubkyAppPost.fromJson(await response.json());

    // Use specs to edit the existing post and store in homeserver
    const result = specsBuilder!.editPost(originalPost, postId, newContent);
    const updateResponse = await homeserver.put(result.meta.url, JSON.stringify(result.post.toJson()));
    await handleHomeserverResponse(updateResponse);

    return result.meta.url;
  });

  const deleteAccount = withAuth(async (setProgress) => {
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
      await homeserver.del(filesToDelete[index]);
      setProgress(Math.round(((index + 1) / totalFiles) * 100));
    }

    // Finally, delete profile.json and update progress to 100%
    await homeserver.del(profileUrl);
    setProgress(100);

    return true;
  });

  const downloadData = withAuth(async (setProgress: (val: number) => void) => {
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
        const response = await homeserver.get(dataUrl);

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
            binary: true
          });
        }

        // Update progress
        setProgress(Math.round(((index + 1) / totalFiles) * 100));
      })
    );

    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(
      2,
      '0'
    )}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

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
  });

  const importData = withAuth(async (zipFile: File, setProgress: React.Dispatch<React.SetStateAction<number>>) => {
    // Load the zip file using JSZip
    const zip = await JSZip.loadAsync(zipFile);

    // Get all files in the zip
    const files = Object.keys(zip.files);

    // Extract files under 'data/' directory
    const dataFiles = files.filter((filename) => filename.startsWith('data/'));

    // Separate 'profile.json' and other files
    const profileFileName = 'pub/pubky.app/profile.json';
    const otherFiles = dataFiles.filter((filename) => filename !== profileFileName);

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
      const response = await homeserver.put(dataUrl, new Uint8Array(content));
      await handleHomeserverResponse(response);

      // Update progress
      setProgress(Math.round(((index + 1) / totalFiles) * 100));
      setProfile(undefined);
    }

    Utils.storage.remove('profile');
    setProfile(undefined);
    return true;
  });

  const getTimestampNotification = withAuth(async (): Promise<number> => {
    try {
      const result = await homeserver.get(specsBuilder!.createLastRead().meta.url);
      // If response is empty or invalid, return 0 as default timestamp
      if (!result || result.status === 404) {
        return 0;
      }

      const data = await result.json();
      return data?.timestamp || 0;
    } catch (error) {
      // Silently return 0 for new users without last_read
      return 0;
    }
  });

  const putTimestampNotification = withAuth(async () => {
    const result = specsBuilder!.createLastRead();
    const lastRead = result.last_read.toJson() as PubkyAppLastRead;

    const response = await homeserver.put(result.meta.url, JSON.stringify(lastRead));
    await handleHomeserverResponse(response);

    setTimestamp(Number(lastRead.timestamp));

    return true;
  });

  const loadSettings = withAuth(async () => {
    if (!pubky) return null;

    // pubky.app/settings is not covered by the specs!
    const settingsUrl = `${baseUriBuilder(pubky)}settings`;

    const response = await homeserver.get(settingsUrl);

    if (!response.ok) {
      return { notifications: defaultPreferences };
    }

    const settings = await response.json();
    return settings;
  });

  const saveSettings = withAuth(
    async (notifications: NotificationPreferences, privacysafety?: any, language?: string) => {
      const settings = { notifications, privacysafety, language };

      const settingsUrl = `${baseUriBuilder(pubky!)}settings`;

      const response = await homeserver.put(settingsUrl, JSON.stringify(settings));
      await handleHomeserverResponse(response);

      return true;
    }
  );

  const deletePost = withAuth(async (post: PostView): Promise<boolean> => {
    // delete the post from the timeline
    setTimeline((prevTimeline) => prevTimeline.filter((p) => p.details.id !== post.details.id));

    // delete the post from the new posts
    setNewPosts((prevNewPosts) => prevNewPosts.filter((p) => p.details.id !== post.details.id));

    // delete the post from the deleted posts
    setDeletedPosts((prevDeletedPosts) => [...prevDeletedPosts, post.details.id]);

    // delete the post from the replies
    setReplies((prevReplies) => prevReplies.filter((p) => p.details.id !== post.details.id));

    // If this is a reply, update the parent post's reply count
    if (post.relationships?.replied) {
      const parentUri = post.relationships.replied;
      setTimeline((prevTimeline) =>
        prevTimeline.map((p) => {
          if (p.details.uri === parentUri) {
            return {
              ...p,
              counts: {
                ...p.counts,
                replies: (p.counts?.replies || 0) - 1
              }
            };
          }
          return p;
        })
      );
    }

    // If this is a repost, update grouped reposts optimistically
    if (post.relationships?.reposted) {
      const repostedUri = post.relationships.reposted;
      setTimeline(
        (prevTimeline) =>
          prevTimeline
            .map((p) => {
              // Check if this post is a grouped repost of the same reposted content
              if (
                p.groupedReposts &&
                p.uniqueReposters &&
                p.groupedReposts.some((r) => r.relationships?.reposted === repostedUri)
              ) {
                // Remove the current user's reposts from groupedReposts
                const updatedGroupedReposts = p.groupedReposts.filter((r) => r.details.author !== pubky);

                // If no reposts left, remove the entire grouped repost
                if (updatedGroupedReposts.length === 0) {
                  return null;
                }

                // Reconstruct uniqueReposters from the remaining groupedReposts, maintaining chronological order
                const remainingReposters = updatedGroupedReposts
                  .sort((a, b) => a.details.indexed_at - b.details.indexed_at)
                  .map((r) => r.details.author);

                // Remove duplicates while preserving order
                const updatedUniqueReposters = [...new Set(remainingReposters)];

                // Update the grouped repost with new uniqueReposters
                return {
                  ...p,
                  uniqueReposters: updatedUniqueReposters,
                  repostCount: updatedGroupedReposts.length,
                  groupedReposts: updatedGroupedReposts
                };
              }
              return p;
            })
            .filter(Boolean) as PostView[]
      );

      // Also update newPosts
      setNewPosts(
        (prevNewPosts) =>
          prevNewPosts
            .map((p) => {
              if (
                p.groupedReposts &&
                p.uniqueReposters &&
                p.groupedReposts.some((r) => r.relationships?.reposted === repostedUri)
              ) {
                const updatedGroupedReposts = p.groupedReposts.filter((r) => r.details.author !== pubky);

                if (updatedGroupedReposts.length === 0) {
                  return null;
                }

                const remainingReposters = updatedGroupedReposts
                  .sort((a, b) => a.details.indexed_at - b.details.indexed_at)
                  .map((r) => r.details.author);

                const updatedUniqueReposters = [...new Set(remainingReposters)];

                return {
                  ...p,
                  uniqueReposters: updatedUniqueReposters,
                  repostCount: updatedGroupedReposts.length,
                  groupedReposts: updatedGroupedReposts
                };
              }
              return p;
            })
            .filter(Boolean) as PostView[]
      );

      // Also update replies
      setReplies(
        (prevReplies) =>
          prevReplies
            .map((p) => {
              if (
                p.groupedReposts &&
                p.uniqueReposters &&
                p.groupedReposts.some((r) => r.relationships?.reposted === repostedUri)
              ) {
                const updatedGroupedReposts = p.groupedReposts.filter((r) => r.details.author !== pubky);

                if (updatedGroupedReposts.length === 0) {
                  return null;
                }

                const remainingReposters = updatedGroupedReposts
                  .sort((a, b) => a.details.indexed_at - b.details.indexed_at)
                  .map((r) => r.details.author);

                const updatedUniqueReposters = [...new Set(remainingReposters)];

                return {
                  ...p,
                  uniqueReposters: updatedUniqueReposters,
                  repostCount: updatedGroupedReposts.length,
                  groupedReposts: updatedGroupedReposts
                };
              }
              return p;
            })
            .filter(Boolean) as PostView[]
      );

      // Also update timelineProfile
      setTimelineProfile(
        (prevTimelineProfile) =>
          prevTimelineProfile
            .map((p) => {
              if (
                p.groupedReposts &&
                p.uniqueReposters &&
                p.groupedReposts.some((r) => r.relationships?.reposted === repostedUri)
              ) {
                const updatedGroupedReposts = p.groupedReposts.filter((r) => r.details.author !== pubky);

                if (updatedGroupedReposts.length === 0) {
                  return null;
                }

                const remainingReposters = updatedGroupedReposts
                  .sort((a, b) => a.details.indexed_at - b.details.indexed_at)
                  .map((r) => r.details.author);

                const updatedUniqueReposters = [...new Set(remainingReposters)];

                return {
                  ...p,
                  uniqueReposters: updatedUniqueReposters,
                  repostCount: updatedGroupedReposts.length,
                  groupedReposts: updatedGroupedReposts
                };
              }
              return p;
            })
            .filter(Boolean) as PostView[]
      );
    }

    // delete the files
    if (post?.details?.attachments?.length > 0) {
      const fileDeletions = Object.values(post?.details?.attachments).map(async (file) => {
        await deleteFile(file);
      });
      await Promise.all(fileDeletions);
    }

    // Post URL
    const postUrl = postUriBuilder(pubky!, post.details.id);

    // Send the post to the homeserver
    const response = await homeserver.del(postUrl);
    await handleHomeserverResponse(response);

    return true;
  });

  const saveFeed = withAuth(async (feed: ICustomFeed, name: string): Promise<boolean> => {
    // Map the ICustomFeed to the arguments for `createFeed`:
    // feed might have e.g. tags, reach, layout, etc.
    const { tags, reach, layout, sort, content } = feed;

    // If feed.tags is null, pass null. Otherwise pass as is.
    const tagsValue = tags && tags.length > 0 ? tags : null;
    const contentVal = content === 'all' ? null : content ? (contentTypeMap[content] ?? content) : null;

    const result = specsBuilder!.createFeed(tagsValue, reach, layout, sort, contentVal, name);

    const feedObj = result.feed.toJson();
    const response = await homeserver.put(result.meta.url, JSON.stringify(feedObj));
    await handleHomeserverResponse(response);

    return true;
  });

  const updateFeed = withAuth(
    async (originalFeed: ICustomFeed, updatedFeed: ICustomFeed, name: string): Promise<boolean> => {
      // First delete the existing feed
      await deleteFeed(originalFeed);

      // Then create a new feed with the updated values
      await saveFeed(updatedFeed, name);
      return true;
    }
  );

  const loadFeeds = withAuth(async (): Promise<{ feed: ICustomFeed; name: string }[]> => {
    // Define the feeds directory path
    const feedsDirUrl = `pubky://${pubky}/pub/pubky.app/feeds/`;
    const feedUris = await client.list(feedsDirUrl);

    // Fetch each feed data
    const feedsData = await Promise.all(
      feedUris.map(async (uri) => {
        try {
          const response = await homeserver.get(uri);
          const feed = await response.json();
          return feed;
        } catch (error) {
          console.error(`Error fetching feed from ${uri}:`, error);
          return null;
        }
      })
    );

    // Filter out any null entries and assert the result type
    return feedsData.filter((feed): feed is { feed: ICustomFeed; name: string } => feed !== null);
  });

  const deleteFeed = withAuth(async (feed: ICustomFeed): Promise<boolean> => {
    // Map the ICustomFeed to the arguments for `createFeed`:
    // feed might have e.g. tags, reach, layout, etc.
    const { tags, reach, layout, sort, content } = feed;

    // If feed.tags is null, pass null. Otherwise pass as is.
    const tagsValue = tags && tags.length > 0 ? tags : null;
    const contentVal = content === 'all' ? null : content ? (contentTypeMap[content] ?? content) : null;

    // create feed according to specs to compute ID and URL
    const result = specsBuilder!.createFeed(tagsValue, reach, layout, sort, contentVal, 'placeholder');

    // Delete the feed from the homeserver
    await homeserver.del(result.meta.url);

    return true;
  });

  const generateAuthUrl = async (caps?: string) => {
    const capabilities = caps || '/pub/pubky.app/:rw';

    try {
      const authRequest = client.authRequest(NEXT_PUBLIC_DEFAULT_HTTP_RELAY, capabilities);

      return {
        url: String(authRequest.url()),
        promise: authRequest.response()
      };
    } catch (error) {
      handleError(error, 'generateAuthUrl');
      return null;
    }
  };

  const follow = withAuth(async (user_id: string): Promise<boolean> => {
    const result = specsBuilder!.createFollow(user_id);
    userProfileCache.delete(user_id);

    const response = await homeserver.put(result.meta.url, JSON.stringify(result.follow.toJson()));
    await handleHomeserverResponse(response);

    return true;
  });

  const unfollow = withAuth(async (user_id: string): Promise<boolean> => {
    const result = specsBuilder!.createFollow(user_id);
    userProfileCache.delete(user_id);

    const response = await homeserver.del(result.meta.url);

    await handleHomeserverResponse(response);

    return true;
  });

  const deleteFile = withAuth(async (file_uri: string): Promise<boolean> => {
    // TODO: we are not deleting the `/blob`

    await homeserver.del(file_uri);

    return true;
  });

  const mute = withAuth(async (user_id: string): Promise<boolean> => {
    const result = specsBuilder!.createMute(user_id);

    const response = await homeserver.put(result.meta.url, JSON.stringify(result.mute.toJson()));
    await handleHomeserverResponse(response);

    return true;
  });

  const unmute = withAuth(async (user_id: string): Promise<boolean> => {
    const result = specsBuilder!.createMute(user_id);

    const response = await homeserver.del(result.meta.url);
    await handleHomeserverResponse(response);

    return true;
  });

  const addBookmark = withAuth(async (postId: string, authorId: string): Promise<boolean | string> => {
    const uriPost = postUriBuilder(authorId, postId);
    const result = specsBuilder!.createBookmark(uriPost);

    const response = await homeserver.put(result.meta.url, JSON.stringify(result.bookmark.toJson()));
    await handleHomeserverResponse(response);

    return result.meta.id;
  });

  const deleteBookmark = withAuth(async (postId: string, authorId: string): Promise<boolean> => {
    const uriPost = postUriBuilder(authorId, postId);
    const result = specsBuilder!.createBookmark(uriPost);

    const response = await homeserver.del(result.meta.url);

    await handleHomeserverResponse(response);

    return true;
  });

  const createTag = withAuth(async (authorId: string, postId: string, label: string): Promise<boolean> => {
    try {
      const postUri = postUriBuilder(authorId, postId);
      const result = specsBuilder!.createTag(postUri, label);

      const response = await homeserver.put(result.meta.url, JSON.stringify(result.tag.toJson()));
      await handleHomeserverResponse(response);

      return true;
    } catch (error) {
      handleError(error, 'createTag');
      return false;
    }
  });

  const deleteTag = withAuth(async (authorId: string, postId: string, tagLabel: string): Promise<boolean> => {
    try {
      // Compute tag URL and ID based on tag object content using the builder
      const uriPost = postUriBuilder(authorId, postId);
      const result = specsBuilder!.createTag(uriPost, tagLabel);

      const response = await homeserver.del(result.meta.url);
      await handleHomeserverResponse(response);

      return true;
    } catch (error) {
      handleError(error, 'deleteTag');
      return false;
    }
  });

  const createTagProfile = withAuth(async (userId: string, label: string): Promise<boolean> => {
    const uriProfile = userUriBuilder(userId);
    const result = specsBuilder!.createTag(uriProfile, label);

    const response = await homeserver.put(result.meta.url, JSON.stringify(result.tag.toJson()));
    await handleHomeserverResponse(response);

    return true;
  });

  const deleteTagProfile = withAuth(async (userId: string, label: string): Promise<boolean> => {
    const uriProfile = userUriBuilder(userId);

    // Compute ID and URL for a from its content (unique)
    const result = specsBuilder!.createTag(uriProfile, label);

    const response = await homeserver.del(result.meta.url);
    await handleHomeserverResponse(response);

    return true;
  });

  return (
    <PubkyClientContext.Provider
      value={{
        deletedPosts,
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
        isOnline,
        setIsOnline,
        saveProfile,
        saveFeed,
        updateFeed,
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
        editArticle,
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
        singlePost,
        setSinglePost
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PubkyClientContext.Provider>
  );
}

export function usePubkyClientContext() {
  return useContext(PubkyClientContext);
}
