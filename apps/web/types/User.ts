export interface UserCounts {
  followers: number;
  following: number;
  friends: number;
  posts: number;
  tags: number;
}

export interface UserDetails {
  bio?: string;
  id: string;
  indexed_at: number;
  links?: UserLink[];
  name: string;
  image?: string;
  status?: string;
}

export interface UserLink {
  title: string;
  url: string;
}

export interface UserTags {
  label: string;
  tagged: Tag[];
}

export interface UserView {
  counts: UserCounts;
  details: UserDetails;
  relationship: Relationship;
  tags: UserTags[];
}

export interface Relationship {
  following: boolean;
  followed_by: boolean;
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

export type UserStreamType =
  | 'Followers'
  | 'Following'
  | 'Friends'
  | 'MostFollowed'
  | 'Pioneers';

export interface UserTag {
  label: string;
  tagged: Tag[];
}
