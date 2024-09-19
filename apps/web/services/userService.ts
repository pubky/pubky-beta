import {
  UserView,
  UserCounts,
  UserDetails,
  UserSearch,
  UserStream,
  UserTag,
  Relationship,
} from '../types/User';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

export async function getUserDetails(userId: string): Promise<UserDetails> {
  const response = await fetch(`${BASE_URL}/user/${userId}/details`);

  if (!response.ok) throw new Error('Failed to fetch user details');

  return response.json();
}

export async function getUserProfile(userId: string): Promise<UserView> {
  const response = await fetch(`${BASE_URL}/user/${userId}`);

  if (!response.ok) throw new Error('Failed to fetch user profile');

  return response.json();
}

export async function getUserCounts(userId: string): Promise<UserCounts> {
  const response = await fetch(`${BASE_URL}/user/${userId}/counts`);

  if (!response.ok) throw new Error('Failed to fetch user counts');

  return response.json();
}

export async function getUserFollowers(
  userId: string,
  skip?: number,
  limit?: number
): Promise<string[]> {
  const queryParams = new URLSearchParams({ userId });

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/user/${userId}/followers?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user followers');

  return response.json();
}

export async function getUserFollowing(
  userId: string,
  skip?: number,
  limit?: number
): Promise<string[]> {
  const queryParams = new URLSearchParams({ userId });

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/user/${userId}/following?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user following');

  return response.json();
}

export async function getUserFriends(
  userId: string,
  skip?: number,
  limit?: number
): Promise<string[]> {
  const queryParams = new URLSearchParams({ userId });

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/user/${userId}/friends?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user friends');

  return response.json();
}

export async function getUserRelationship(
  userId: string,
  viewerId: string
): Promise<Relationship> {
  const response = await fetch(
    `${BASE_URL}/user/${userId}/relationship/${viewerId}`
  );

  if (!response.ok) throw new Error('Failed to fetch user relationship');

  return response.json();
}

export async function searchUsers(
  username?: string,
  skip?: number,
  limit?: number
): Promise<UserSearch> {
  const queryParams = new URLSearchParams();

  queryParams.append('username', username || '');
  queryParams.append('skip', String(skip));
  queryParams.append('limit', String(limit));

  const response = await fetch(`${BASE_URL}/search/users?${queryParams}`);

  if (!response.ok) throw new Error('Failed to search users');

  return response.json();
}

export async function getUserStream(
  viewerId?: string,
  skip?: number,
  limit?: number,
  streamType?: string
): Promise<UserStream> {
  const queryParams = new URLSearchParams();

  if (viewerId) queryParams.append('viewer_id', viewerId);
  if (skip) queryParams.append('skip', String(skip));
  if (limit) queryParams.append('limit', String(limit));
  if (streamType) queryParams.append('stream_type', streamType);

  const response = await fetch(
    `${BASE_URL}/stream/users?${queryParams.toString()}`
  );

  if (!response.ok) throw new Error('Failed to fetch user stream');

  return response.json();
}

export async function getMostFollowedUsers(
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  queryParams.append('viewer_id', viewerId || '');
  queryParams.append('skip', String(skip));
  queryParams.append('limit', String(limit));

  const response = await fetch(
    `${BASE_URL}/stream/users/most-followed?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch most followed users');

  return response.json();
}

export async function getPioneerUsers(
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  if (viewerId) queryParams.append('viewer_id', viewerId);

  queryParams.append('skip', String(skip));
  queryParams.append('limit', String(limit));

  const response = await fetch(
    `${BASE_URL}/stream/users/pioneers?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch pioneer users');

  return response.json();
}

export async function getUserTags(userId: string): Promise<UserTag[]> {
  const response = await fetch(`${BASE_URL}/user/${userId}/tags`);

  if (!response.ok) throw new Error('Failed to fetch user tags');

  return response.json();
}

export async function searchUsersByUsername(
  username: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<UserView[]> {
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
    `${BASE_URL}/stream/users/username-search?${queryParams.toString()}`
  );
  if (!response.ok) throw new Error('Failed to search users by username');
  return response.json();
}
