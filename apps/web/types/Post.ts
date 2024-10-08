/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostCounts {
  replies: number;
  reposts: number;
  tags: number;
}

export interface FileContent {
  content_type: string;
  created_at: number;
  id: string;
  indexed_at: number;
  name: string;
  owner_id: string;
  size: number;
  src: string;
  uri: string;
  urls: {
    main: string;
  };
}

export interface PostDetails {
  author: string;
  content: string;
  id: string;
  indexed_at: number;
  kind: 'Short' | 'Long' | 'Image' | 'Video' | 'Link' | 'File';
  uri: string;
}

export interface PostView {
  details: PostDetails;
  counts: PostCounts;
  tags: PostTag[];
  relationships?: PostRelationships;
  bookmark?: Bookmark;
  files: FileContent[];
}

export interface PostRelationships {
  mentioned?: string[];
  replied?: string;
  reposted?: string;
}

export interface Bookmark {
  id: string;
  indexed_at: number;
}

export interface PostTag {
  label: string;
  taggers: string[];
  taggers_count: number;
}

export interface PostStream {
  posts: PostView[];
}

export interface PostThread {
  root_post: PostView;
  replies: PostView[];
}

export interface Tag {
  tag_id: string;
  indexed_at: number;
  tagger_id: string;
}

export interface PostEmbed {
  kind: PostKind;
  uri: string;
  postId?: string;
}

export interface PubkyAppPost {
  content: string;
  kind: PostKind;
  parent?: string;
  embed?: PostEmbed | null;
}

export interface PubkyAppFile {
  name: string;
  created_at: number;
  src: string;
  content_type: string;
  size: number;
}
export interface Links {
  [key: string]: {
    title: string;
    url: string;
  };
}

export interface PubkyAppUser {
  name: string;
  bio?: string;
  image?: File | string;
  links?: Links | any;
  status?: string;
}

export type PostStreamReach = 'Following' | 'Followers' | 'Friends';
export type PostStreamSorting = 'Timeline' | 'TotalEngagement';
export type PostKind = 'Short' | 'Long' | 'Image' | 'Video' | 'Link' | 'File';
