import { PubkyAppPostKind } from 'pubky-app-specs';

export interface PostCounts {
  replies: number;
  reposts: number;
  tags: number;
  unique_tags: number;
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
  urls: string;
}

export interface PostDetails {
  attachments?: string[];
  author: string;
  content: string;
  id: string;
  indexed_at: number;
  kind: PubkyAppPostKind;
  uri: string;
}

export interface PostView {
  details: PostDetails;
  counts: PostCounts;
  tags: PostTag[];
  relationships?: PostRelationships;
  bookmark?: Bookmark;
  cached: 'local' | 'homeserver' | 'nexus';
  groupedReposts?: PostView[];
  repostCount?: number;
  uniqueReposters?: string[];
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
  relationship?: boolean;
}

export interface Tag {
  tag_id: string;
  indexed_at: number;
  tagger_id: string;
}

export interface FileView {
  name: string;
  created_at: number;
  src: string;
  content_type: string;
  size: number;
  id: string;
  indexed_at: number;
  owner_id: string;
  uri: string;
  urls: string; // TODO change type
}

export interface Links {
  title: string;
  url: string;
  placeHolder?: string;
}

export type PostType = 'timeline' | 'replies' | 'single' | 'repost' | 'parent';
