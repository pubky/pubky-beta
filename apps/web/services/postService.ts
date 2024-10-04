import {
  PostView,
  PostCounts,
  PostDetails,
  PostStream,
  PostThread,
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
  sorting?: string
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
  if (sorting) {
    queryParams.append('sorting', String(sorting));
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

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/stream/posts/user/${userId}?${queryParams}`
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

export async function getPostThread(
  authorId: string,
  postId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<PostThread> {
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

  const response = await fetch(
    `${BASE_URL}/thread/${authorId}/${postId}?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch post thread');

  return response.json();
}

export async function getBookmarkedPosts(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
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

  const response = await fetch(
    `${BASE_URL}/stream/posts/bookmarks/${userId}?${queryParams.toString()}`
  );

  if (!response.ok) throw new Error('Failed to fetch bookmarked posts');

  return response.json();
}
