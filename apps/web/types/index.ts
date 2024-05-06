export type TLayouts = 'grid' | 'columns' | 'list' | 'sidebar';
export type TSize = 'full' | 'normal';
export type TSort = 'recent' | 'tags' | 'activity';
export type TReach = 'following' | 'followers' | 'friends' | 'all';
export type THotTagsReach = 'following' | 'followers' | 'friends' | 'all';
export type TContacts = 'following' | 'followers' | 'friends';
export type TContactsLayout = 'ranking' | 'list';
export type TContent = 'all' | 'posts' | 'images' | 'videos' | 'links';
export type TTimeframe = 'today' | 'month' | 'all';

export interface ClientContextType {
  hotTags: ITaggedPost[] | null;
  mostFollowed: IMostFollowed[] | null;
  recommendedProfiles: IRecommendedProfiles[] | null;
  profile: IProfile | null;
  pubky: string | null;
  posts: INewPost;
  signUp: (
    profile: IProfilePubkyProps,
    password: string
  ) => Promise<ISignUpResponse | false>;
  logout: () => Promise<boolean>;
  getProfile: () => Promise<IProfile | null>;
  saveProfile: (profile: IProfilePubkyProps) => Promise<ISaveProfile | null>;
  getUserIndexed: (userId: string) => Promise<IUserProfile | null>;
  createPost: (content: string) => Promise<IPost | null>;
  deletePost: (postId: string) => Promise<IDeletePost | null>;
  createBookmark: (postId: string) => Promise<IBookmark | null>;
  deleteBookmark: (
    postId: string,
    bookmarkId: string
  ) => Promise<IBookmark | null>;
  createTag: (uri: string, tag: string) => Promise<ICreateTagResponse | null>;
  deleteTag: (uri: string, tag: string) => Promise<IDeleteTagResponse | null>;
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
  getRecommendedProfiles: (
    pk: string
  ) => Promise<IRecommendedProfiles[] | null>;
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
  searchTags: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPosts: any;
  setSearchTags: (value: string[]) => Promise<IPost | null>;
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
  bookmark: BookmarkPost;
  createdAt: number;
  indexedAt: number;
}

export interface BookmarkPost {
  id: string;
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

export interface IDeleteTagResponse {
  id: string;
  uri: string;
}

export interface IDeletePost {
  id: string;
}

export interface IBookmark {
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
  followersCount: number;
  followingCount: number;
  indexedAt: number;
  uri: string;
  profile: IProfileSimplified;
}

export interface IFollowing {
  createdAt: number;
  followersCount: number;
  followingCount: number;
  indexedAt: number;
  uri: string;
  profile: IProfileSimplified;
}

export interface IFriend {
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

export interface LoadingContacts {
  [pubky: string]: boolean;
}

export interface IFollowingResponse {
  count: number;
  following: IFollowing[];
}

export interface IFriendsResponse {
  count: number;
  friends: IFriend[];
}

export interface IMostFollowed {
  id: string;
  uri: string;
  profile: IProfile;
  followers: number;
}

export interface IRecommendedProfiles {
  id: string;
  uri: string;
  profile: IProfile;
  followers: number;
}

export interface INewPost {
  [key: string]: IPost;
}
