export type TLayouts = 'columns' | 'wide' | 'visual' | 'focus';
export type TStatus =
  | 'available'
  | 'away'
  | 'vacationing'
  | 'working'
  | 'traveling'
  | 'celebrating'
  | 'sick'
  | 'noStatus';
export type TSize = 'full' | 'normal';
export type TReach = 'following' | 'friends' | 'followers' | 'all';
export type TSource =
  | 'following'
  | 'friends'
  | 'followers'
  | 'bookmarks'
  | 'post_replies'
  | 'author'
  | 'author_replies'
  | 'all';
export type TSourceUser =
  | 'following'
  | 'friends'
  | 'followers'
  | 'recommended'
  | 'muted'
  | 'influencers'
  | 'most_followed'
  | 'all';
export type TLanguage = 'english' | 'spanish' | 'german' | 'french' | 'italian';
export type TSort = 'recent' | 'popularity';
export type THotTagsReach = 'following' | 'followers' | 'friends' | 'all';
export type TContacts = 'following' | 'followers' | 'friends';
export type TContactsLayout = 'ranking' | 'list';
export type TContent = 'all' | 'posts' | 'articles' | 'images' | 'videos' | 'links' | 'files';
export type TTimeframe = 'today' | 'this_month' | 'all_time';

export interface IFileContent {
  contentType: string;
  createdAt: number;
  id: string;
  indexedAt: number;
  metadata: Record<string, string>;
  owner: string;
  size: number;
  src: string;
  uri: string;
  urls: { main: string };
}

export interface NotificationsResponse {
  feed: INotification[];
  newest: string;
  oldest: string;
}

interface BodyNotification {
  followedBy?: string;
  unfollowedBy?: string;
  taggedBy?: string;
  tag?: string;
  repliedBy?: string;
  parentPostUri?: string;
  postUri?: string;
  replyUri?: string;
  repostedBy?: string;
  mentionedBy?: string;
  embedUri?: string;
  repostUri?: string;
  deleteType?: string | IReply;
  deletedBy?: string;
  deletedUri?: string;
  linkedUri?: string;
}

export type NotificationPreferences = {
  follow: boolean;
  new_friend: boolean;
  lost_friend: boolean;
  tag_post: boolean;
  tag_profile: boolean;
  mention: boolean;
  reply: boolean;
  repost: boolean;
  post_deleted: boolean;
  post_edited: boolean;
};

export interface INotification {
  body: BodyNotification;
  id: string;
  timestamp: number;
  type: string;
}

export interface ILink {
  url: string;
  title: string;
}

export interface ILinkPubky {
  [key: string]: string | undefined;
}

export interface IProfile {
  name: string;
  bio: string;
  image: string;
  links: ILink[];
  status?: TStatus;
}

export interface IAuthor {
  id: string;
  uri: string;
  profile: IProfile;
}

export interface IPostContent {
  content: string;
  parent?: string;
  root?: string;
  embed?: EmbedContent;
  files?: { [key: string]: { fileId: string; fileUri: string } };
}

export interface ICustomFeed {
  tags?: string[];
  sort: TSort;
  reach: TSource;
  layout: TLayouts;
  content: TContent;
}

export interface EmbedContent {
  post: IPost;
  type: string;
  uri: string;
}

export interface IPost {
  id: string;
  uri: string;
  author: IAuthor;
  post: IPostContent;
  tags: ITaggedPost[];
  bookmark: BookmarkPost;
  repliesCount: number;
  repostsCount: number;
  createdAt: number;
  indexedAt: number;
}

export interface IReply {
  post: IPost;
  replies: [];
}

export interface BookmarkPost {
  id: string;
}

export interface ITag {
  tag: string;
  count: number;
  from: { image: string }[];
}

export interface IFollowed {
  profile: { image: string; name: string };
  id: string;
}

interface IViewer {}

export interface IUserProfile {
  profile: IProfile;
  tagsCount: number;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
  postsCount: number;
  taggedAs: ITaggedProfile[];
  userId: string;
  viewer: IViewer;
}

export interface ISaveProfile {
  uri: string;
}

export interface IProfilePubkyProps {
  bio: string | undefined;
  image: string | undefined | File;
  links: ILinkPubky | undefined;
  name: string | undefined;
}

export interface ISignUpResponse {
  bio: string | undefined;
  image: string | undefined;
  links: ILinkPubky | undefined;
  name: string | undefined;
}

export interface IRecoveryFileResponse {
  recoveryFile: Buffer;
  filename: string;
}

export interface ICreatePostResponse {
  id: string;
  uri: string;
}

export interface ICreateRepostResponse {
  id: string;
  uri: string;
}

export interface ICreateReplyResponse {
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

export interface ITaggedProfile {
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
  tagsCount: number;
  postsCount: number;
  indexedAt: number;
  uri: string;
  profile: IProfileSimplified;
}

export interface IFriend {
  createdAt: number;
  indexedAt: number;
  uri: string;
  followersCount: number;
  followingCount: number;
  tagsCount: number;
  postsCount: number;
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
