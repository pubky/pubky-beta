import {
  UserView,
  UserCounts,
  UserDetails,
  UserSearch,
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

export async function getUserProfile(
  userId: string,
  viewerId: string
): Promise<UserView> {
  const queryParams = new URLSearchParams();

  if (viewerId) queryParams.append('viewer_id', viewerId);

  const response = await fetch(`${BASE_URL}/user/${userId}?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch user profile');

  return response.json();
}

export async function getUserCounts(userId: string): Promise<UserCounts> {
  const response = await fetch(`${BASE_URL}/user/${userId}/counts`);

  if (!response.ok) throw new Error('Failed to fetch user counts');

  return response.json();
}

export async function getUserStreamFollowers(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
): Promise<UserView[]> {
  const queryParams = new URLSearchParams({ userId });

  source = source ?? 'followers';
  queryParams.append('viewer_id', String(viewerId));

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  if (source !== undefined) {
    queryParams.append('source', String(source));
  }

  const response = await fetch(
    `${BASE_URL}/stream/users?user_id=${userId}&${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user followers');

  return response.json();
}

export async function getUserStreamFollowing(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
): Promise<UserView[]> {
  const queryParams = new URLSearchParams({ userId });

  source = source ?? 'following';
  queryParams.append('viewer_id', String(viewerId));

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  if (source !== undefined) {
    queryParams.append('source', String(source));
  }

  const response = await fetch(
    `${BASE_URL}/stream/users?user_id=${userId}&${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user following');

  return response.json();
}

export async function getUserStreamFriends(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
): Promise<UserView[]> {
  const queryParams = new URLSearchParams({ userId });

  source = source ?? 'friends';
  queryParams.append('viewer_id', String(viewerId));

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  if (source !== undefined) {
    queryParams.append('source', String(source));
  }

  const response = await fetch(
    `${BASE_URL}/stream/users?user_id=${userId}&${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user friends');

  return response.json();
}

export async function getUserStreamMuted(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  source = source ?? 'muted';
  queryParams.append('viewer_id', String(viewerId));

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  if (source !== undefined) {
    queryParams.append('source', String(source));
  }

  const response = await fetch(
    `${BASE_URL}/stream/users?user_id=${userId}&${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user muted');

  return response.json();
}

export async function getUserFollowers(
  userId: string,
  skip?: number,
  limit?: number
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip) queryParams.append('skip', String(skip));
  if (limit) queryParams.append('limit', String(limit));

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
  const queryParams = new URLSearchParams();

  if (skip) queryParams.append('skip', String(skip));
  if (limit) queryParams.append('limit', String(limit));

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
  const queryParams = new URLSearchParams();

  if (skip) queryParams.append('skip', String(skip));
  if (limit) queryParams.append('limit', String(limit));

  const response = await fetch(
    `${BASE_URL}/user/${userId}/friends?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user friends');

  return response.json();
}

export async function getUserMuted(
  userId: string,
  skip?: number,
  limit?: number
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip) queryParams.append('skip', String(skip));
  if (limit) queryParams.append('limit', String(limit));

  const response = await fetch(
    `${BASE_URL}/user/${userId}/muted?${queryParams}`
  );

  if (!response.ok) throw new Error('Failed to fetch user muted');

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
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number,
  source?: string
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  queryParams.append('user_id', userId);
  if (viewerId) queryParams.append('viewer_id', viewerId);
  if (skip) queryParams.append('skip', String(skip));
  if (limit) queryParams.append('limit', String(limit));
  if (source) queryParams.append('source', source);

  const response = await fetch(`${BASE_URL}/stream/users?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch user stream');

  return response.json();
}

export async function getMostFollowedUsers(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  queryParams.append('user_id', String(userId));

  if (viewerId) queryParams.append('viewer_id', viewerId);

  queryParams.append('skip', String(skip));
  queryParams.append('limit', String(limit));
  queryParams.append('source', 'most_followed');

  const response = await fetch(`${BASE_URL}/stream/users?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch most followed users');

  return response.json();
}

export async function getInfluencersUsers(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  queryParams.append('user_id', String(userId));

  if (viewerId) queryParams.append('viewer_id', viewerId);

  queryParams.append('skip', String(skip));
  queryParams.append('limit', String(limit));
  queryParams.append('source', 'pioneers');

  const response = await fetch(`${BASE_URL}/stream/users?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch influencers users');

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
    `${BASE_URL}/stream/users/username?${queryParams.toString()}`
  );
  if (!response.ok) throw new Error('Failed to search users by username');
  return response.json();
}
