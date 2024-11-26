import { UserView, UserDetails, UserSearch } from '../types/User';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

export async function getUserDetails(userId: string): Promise<UserDetails> {
  const response = await fetch(`${BASE_URL}/user/${userId}/details`);

  if (!response.ok) throw new Error('Failed to fetch user details');

  return response.json();
}

export async function getUserProfile(
  userId: string,
  viewerId: string
): Promise<UserView> {
  if (!userId) throw new Error('User ID is required');

  const queryParams = new URLSearchParams();

  if (viewerId) queryParams.append('viewer_id', viewerId);

  const response = await fetch(`${BASE_URL}/user/${userId}?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch user profile');

  return response.json();
}

export async function getUserStream(
  userId: string,
  viewerId: string,
  source: string, // followers, following, friends, muted, most_followed
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

export async function getUserList(
  userId: string,
  source: string, // followers, following, friends, muted, most_followed
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

  const response = await fetch(
    `${BASE_URL}/user/${userId}/${source}?${queryParams}`
  );

  if (!response.ok) throw new Error(`Failed to fetch user ${source}`);

  return response.json();
}

export async function searchUsers(
  username: string,
  skip?: number,
  limit?: number
): Promise<UserSearch> {
  const queryParams = new URLSearchParams();

  queryParams.append('username', username);
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(`${BASE_URL}/search/users?${queryParams}`);

  if (!response.ok) throw new Error('Failed to search users');

  return response.json();
}

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
