import {
  PostView,
  PostCounts,
  PostDetails,
  PostStream,
  Bookmark,
} from '../types/Post';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

export async function getPost(
  authorId: string,
  postId: string,
  viewerId?: string
): Promise<PostView> {
  const queryParams = new URLSearchParams();

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }

  const response = await fetch(
    `${BASE_URL}/post/${authorId}/${postId}?${queryParams.toString()}`
  );

  if (!response.ok) throw new Error('Failed to fetch post');

  return response.json();
}

export async function getPostDetails(
  authorId: string,
  postId: string
): Promise<PostDetails> {
  const response = await fetch(
    `${BASE_URL}/post/${authorId}/${postId}/details`
  );

  if (!response.ok) throw new Error('Failed to fetch post details');

  return response.json();
}

export async function getPostCounts(
  authorId: string,
  postId: string
): Promise<PostCounts> {
  const response = await fetch(`${BASE_URL}/post/${authorId}/${postId}/counts`);

  if (!response.ok) throw new Error('Failed to fetch post counts');

  return response.json();
}

export async function getPostBookmark(
  authorId: string,
  postId: string
): Promise<Bookmark> {
  const response = await fetch(
    `${BASE_URL}/post/${authorId}/${postId}/bookmark`
  );

  if (!response.ok) throw new Error('Failed to fetch post bookmark');

  return response.json();
}

export async function getPostStream(
  viewerId?: string,
  skip?: number,
  limit?: number,
  reach?: 'following' | 'friends' | 'followers' | 'all',
  sort?: 'recent' | 'popularity',
  tags?: string[]
): Promise<PostView[]> {
  const queryParams = new URLSearchParams();

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
    queryParams.append('observer_id', viewerId);
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  if (reach) {
    queryParams.append('source', String(reach));
  }
  if (sort) {
    if (sort === 'recent') queryParams.append('sorting', String('timeline'));
    else if (sort === 'popularity')
      queryParams.append('sorting', String('total_engagement'));
  }
  if (tags) {
    queryParams.append('tags', String(tags));
  }

  const response = await fetch(`${BASE_URL}/stream/posts?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch post stream');

  return response.json();
}

export async function getStreamPosts(
  source: string,
  userId: string,
  viewerId?: string,
  limit = 10,
  start?: number,
  end?: number,
  skip?: number
): Promise<PostView[]> {
  const queryParams = new URLSearchParams({
    author_id: userId,
    source: source,
    limit: String(limit),
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

  const response = await fetch(
    `${BASE_URL}/stream/posts?${queryParams.toString()}`
  );

  if (!response.ok) throw new Error('Failed to fetch post stream by user');

  return response.json();
}

export async function getPostStreamByReach(
  viewerId: string,
  reach: string,
  skip?: number,
  limit?: number
): Promise<PostStream> {
  const queryParams = new URLSearchParams({
    viewer_id: viewerId,
    reach,
    skip: String(skip),
    limit: String(limit),
  });

  const response = await fetch(`${BASE_URL}/stream/posts/reach?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch post stream by reach');

  return response.json();
}

export async function getPostReplies(
  authorId: string,
  postId: string,
  viewerId?: string,
  limit = 10,
  start?: number,
  end?: number,
  skip?: number
): Promise<PostView[]> {
  const queryParams = new URLSearchParams({
    author_id: authorId,
    source: 'post_replies',
    post_id: postId,
    limit: String(limit),
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

  const url = `${BASE_URL}/stream/posts?${queryParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch post replies: ${response.statusText}`);
  }

  const data: PostView[] = await response.json();
  return data;
}

export async function getBookmarkedPosts(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<PostView[]> {
  const queryParams = new URLSearchParams();

  if (userId) {
    queryParams.append('user_id', userId);
  }
  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
    queryParams.append('observer_id', viewerId);
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  queryParams.append('source', String('bookmarks'));
  const response = await fetch(
    `${BASE_URL}/stream/posts?${queryParams.toString()}`
  );

  if (!response.ok) throw new Error('Failed to fetch bookmarked posts');

  return response.json();
}
