import { PostView, PostCounts, PostDetails, Bookmark } from '../types/Post';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

// Get post
export async function getPost(
  authorId: string,
  postId: string,
  viewerId?: string,
  maxTags?: number,
  maxTaggers?: number
): Promise<PostView> {
  const queryParams = new URLSearchParams();

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }
  if (maxTags) {
    queryParams.append('skip', String(maxTags));
  }
  if (maxTaggers) {
    queryParams.append('max_taggers', String(maxTaggers));
  }

  const response = await fetch(`${BASE_URL}/post/${authorId}/${postId}?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch post');

  return response.json();
}

// Get post bookmark
export async function getPostBookmark(authorId: string, postId: string, viewerId?: string): Promise<Bookmark> {
  const queryParams = new URLSearchParams();

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }

  const response = await fetch(`${BASE_URL}/post/${authorId}/${postId}/bookmark?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch post bookmark');

  return response.json();
}

// Get post counts
export async function getPostCounts(authorId: string, postId: string): Promise<PostCounts> {
  const response = await fetch(`${BASE_URL}/post/${authorId}/${postId}/counts`);

  if (!response.ok) throw new Error('Failed to fetch post counts');

  return response.json();
}

// Get post details
export async function getPostDetails(authorId: string, postId: string): Promise<PostDetails> {
  const response = await fetch(`${BASE_URL}/post/${authorId}/${postId}/details`);

  if (!response.ok) throw new Error('Failed to fetch post details');

  return response.json();
}

// Get post replies
export async function getPostReplies(
  authorId: string,
  postId: string,
  viewerId?: string,
  limit = 10,
  start?: number,
  end?: number,
  skip?: number,
  order?: 'ascending' | 'descending'
): Promise<PostView[]> {
  const queryParams = new URLSearchParams({
    author_id: authorId,
    source: 'post_replies',
    post_id: postId,
    limit: String(limit)
  });

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }
  if (start !== undefined) {
    queryParams.append('start', String(start));
  }
  if (end !== undefined) {
    queryParams.append('end', String(end));
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (order !== undefined) {
    queryParams.append('order', String(order));
  }

  const url = `${BASE_URL}/stream/posts?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch post replies: ${response.statusText}`);
  }

  const data: PostView[] = await response.json();
  return data;
}

// Get post by taggers
export async function getPostByTaggers(
  authorId: string,
  postId: string,
  label: string,
  skip?: number,
  limit?: number
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(`${BASE_URL}/post/${authorId}/${postId}/taggers/${label}?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch post by taggers');

  return response.json();
}

// Get post by tags
export async function getPostByTags(authorId: string, postId: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/post/${authorId}/${postId}/tags`);

  if (!response.ok) throw new Error('Failed to fetch post by taggers');

  return response.json();
}
