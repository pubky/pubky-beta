export type TLayouts = 'grid' | 'columns' | 'list' | 'sidebar';
export type TSize = 'full' | 'normal';
export type TSort = 'recent' | 'tags' | 'activity';
export type TReach = 'following' | 'followers' | 'friends' | 'all';
export type TContent = 'all' | 'posts' | 'images' | 'videos' | 'links';
export type TTimeframe = 'today' | 'month' | 'all';

export interface ClientContextType {
  hotTags: ITaggedPost[] | null;
  mostFollowed: IMostFollowed[] | null;
  profile: IProfile | null;
  pubky: string | null;
  refreshList: boolean;
  signUp: (
    profile: IProfilePubkyProps,
    password: string
  ) => Promise<ISignUpResponse | false>;
  logout: () => Promise<boolean>;
  getProfile: () => Promise<IProfile | null>;
  saveProfile: (profile: IProfilePubkyProps) => Promise<ISaveProfile | null>;
  getUserIndexed: (userId: string) => Promise<IUserProfile | null>;
  createPost: (content: string) => Promise<ICreatePostResponse | null>;
  createTag: (uri: string, tag: string) => Promise<ICreateTagResponse | null>;
  getHotTags: () => Promise<ITaggedPost[] | null>;
  isLoggedIn: () => Promise<string | false>;
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
}

export interface ILink {
  url: string;
  title: string;
}

export interface ILinkPubky {
  website: string | undefined;
  email: string | undefined;
  x: string | undefined;
  telegram: string | undefined;
}

export interface IProfile {
  name: string;
  bio: string;
  image: string;
  links: ILink[];
}

export interface IAuthor {
  id: string;
  uri: string;
  profile: IProfile;
}

export interface IPostContent {
  content: string;
}

export interface IPost {
  id: string;
  uri: string;
  author: IAuthor;
  post: IPostContent;
  tags: ITaggedPost[];
  createdAt: number;
  indexedAt: number;
}

export interface ITag {
  tag: string;
  count: number;
  from: {
    image: string;
  }[];
}

export interface IFollowed {
  profile: {
    image: string;
    name: string;
  };
  id: string;
}

interface IViewer {}

export interface IUserProfile {
  profile: IProfile;
  tagsCount: number;
  postsCount: number;
  taggedAs: string[];
  viewer: IViewer;
}

export interface ISaveProfile {
  uri: string;
}

export interface IProfilePubkyProps {
  bio: string | undefined;
  image: string | undefined;
  links: ILinkPubky | undefined;
  name: string | undefined;
}

export interface ISignUpResponse {
  recoveryFile: Buffer;
  filename: string;
}

export interface ICreatePostResponse {
  id: string;
  uri: string;
}

export interface ICreateTagResponse {
  id: string;
  uri: string;
}

export interface IPostFrom {
  author: IAuthor;
  createdAt: number;
  indexedAt: number;
  id: string;
}

export interface ITaggedPost {
  tag: string;
  count: number;
  from: IPostFrom[];
}

export interface IFeed {
  feed: IPost[];
  cursor: string;
}

export interface IProfileSimplified {
  bio: string;
  image: string;
  name?: string;
}

export interface IFollower {
  createdAt: number;
  indexedAt: number;
  uri: string;
  profile: IProfileSimplified;
}

export interface IFollowersResponse {
  count: number;
  cursor: string;
  followers: IFollower[];
}

export interface IFollowingResponse {
  count: number;
  following: IFollower[];
}

export interface IMostFollowed {
  id: string;
  uri: string;
  profile: IProfile;
  followers: number;
}
