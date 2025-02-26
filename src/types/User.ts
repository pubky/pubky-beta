import { PubkyAppUserLink } from 'pubky-app-specs';
import { TStatus } from '.';

export interface UserCounts {
  followers: number;
  following: number;
  friends: number;
  posts: number;
  tags: number;
  replies: number;
  tagged: number;
  bookmarks: number;
  unique_tags: number;
}

export interface UserDetails {
  bio?: string;
  id: string;
  indexed_at: number;
  links?: PubkyAppUserLink[];
  name: string;
  image?: string;
  status?: TStatus;
}

export interface UserTags {
  label: string;
  taggers: string[];
  taggers_count: number;
  relationship?: boolean;
}

export interface Taggers {
  users: string[];
  relationship: boolean;
}

export interface UserView {
  counts: UserCounts;
  details: UserDetails;
  relationship: Relationship;
  tags: UserTags[];
}

export interface NotificationView {
  body: BodyNotification;
  timestamp: number;
}

export interface BodyNotification {
  followed_by?: string;
  unfollowed_by?: string;
  post_uri?: string;
  tag_label?: string;
  tagged_by?: string;
  replied_by?: string;
  parent_post_uri?: string;
  reply_uri?: string;
  reposted_by?: string;
  embed_uri?: string;
  repost_uri?: string;
  mentioned_by?: string;
  delete_source?: string;
  deleted_by?: string;
  deleted_uri?: string;
  linked_uri?: string;
  type: string;
  edited_by?: string;
  edited_uri?: string;
  edit_source?: string;
}

export interface Relationship {
  following: boolean;
  followed_by: boolean;
  muted: boolean;
}

export interface Followers {
  followers: string[];
}

export interface Following {
  following: string[];
}

export interface Friends {
  friends: string[];
}

export interface UserSearch {
  users: string[];
}

export interface UserStream {
  users: UserView[];
}

export interface Tag {
  tag_id: string;
  indexed_at: number;
  tagger_id: string;
}

export type UserStreamType = 'Followers' | 'Following' | 'Friends' | 'MostFollowed' | 'Influencers';

export interface UserTag {
  label: string;
  tagged: Tag[];
}
