export interface PostCounts {
  replies: number;
  reposts: number;
  tags: number;
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
  tagged: Tag[];
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

export type PostStreamReach = 'Following' | 'Followers' | 'Friends';
export type PostStreamSorting = 'Timeline' | 'TotalEngagement';
