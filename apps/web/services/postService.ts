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

export async function getPostStreamByUser(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<PostView[]> {
  const queryParams = new URLSearchParams();

  if (userId) {
    queryParams.append('author_id', userId);
    queryParams.append('source', "author");
  }
  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(`${BASE_URL}/stream/posts?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch post stream by user');

  return response.json();
}

export async function getRepliesStreamByUser(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<PostView[]> {
  const queryParams = new URLSearchParams();

  if (userId) {
    queryParams.append('author_id', userId);
    queryParams.append('source', "author_replies");
  }
  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(`${BASE_URL}/stream/posts?${queryParams}`);

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
  skip?: number,
  limit?: number
): Promise<PostView[]> {
  const queryParams = new URLSearchParams();

  queryParams.append('author_id', authorId);
  queryParams.append('source', 'post_replies');
  queryParams.append('post_id', postId);

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(`${BASE_URL}/stream/posts?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch post replies');

  return response.json();
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
