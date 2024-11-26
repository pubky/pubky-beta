import { PostView } from '@/types/Post';
import { UserView } from '@/types/User';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

// Get stream posts
export async function getStreamPosts(
  viewerId?: string,
  skip?: number,
  limit?: number,
  reach?: 'following' | 'friends' | 'followers' | 'all',
  sort?: 'recent' | 'popularity',
  tags?: string[],
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

// Get stream posts 2
export async function getStreamPosts2(
  source: string,
  userId: string,
  viewerId?: string,
  limit = 10,
  start?: number,
  end?: number,
  skip?: number | undefined,
  sort?: 'recent' | 'popularity' | undefined,
  tags?: string[],
): Promise<PostView[]> {
  const queryParams = new URLSearchParams({
    author_id: userId,
    source: source,
    limit: String(limit),
  });

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
    queryParams.append('observer_id', viewerId);
  }

  if (sort) {
    if (sort === 'recent') queryParams.append('sorting', String('timeline'));
    else if (sort === 'popularity')
      queryParams.append('sorting', String('total_engagement'));
  }

  if (tags) {
    queryParams.append('tags', String(tags));
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
    `${BASE_URL}/stream/posts?${queryParams.toString()}`,
  );

  if (!response.ok) throw new Error('Failed to fetch post stream by user');

  return response.json();
}

// Get stream users
export async function getUserStream(
  userId: string,
  viewerId: string,
  source: string, // 'following', 'followers', 'friends', 'muted' and 'recommended'
  skip?: number,
  limit?: number
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  queryParams.append('user_id', String(userId));
  queryParams.append('viewer_id', String(viewerId));

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  queryParams.append('source', String(source));

  const response = await fetch(`${BASE_URL}/stream/users?${queryParams}`);

  if (!response.ok) throw new Error(`Failed to fetch user ${source}`);

  return response.json();
}

// TODO Stream users by ID

// Get stream users from username search
export async function searchUsersByUsername(
  username: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<UserView[]> {
  if (!username) throw new Error('Username is required');

  const queryParams = new URLSearchParams({ username });
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
    `${BASE_URL}/stream/users/username?${queryParams.toString()}`
  );
  if (!response.ok) throw new Error('Failed to search users by username');
  return response.json();
}
