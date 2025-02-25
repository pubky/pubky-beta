import {
  UserView,
  UserCounts,
  UserDetails,
  Relationship,
  UserTag,
  Taggers,
} from '../types/User';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

// User profile
export async function getUserProfile(
  userId: string,
  viewerId: string,
): Promise<UserView> {
  if (!userId) throw new Error('User ID is required');

  const queryParams = new URLSearchParams();

  if (viewerId) queryParams.append('viewer_id', viewerId);

  const response = await fetch(`${BASE_URL}/user/${userId}?${queryParams}`);

  if (!response.ok) throw new Error('Failed to fetch user profile');

  return response.json();
}

// User counts
export async function getUserCounts(userId: string): Promise<UserCounts> {
  if (!userId) throw new Error('User ID is required');

  const response = await fetch(`${BASE_URL}/user/${userId}/counts`);

  if (!response.ok) throw new Error('Failed to fetch user counts');

  return response.json();
}

// User details
export async function getUserDetails(userId: string): Promise<UserDetails> {
  if (!userId) throw new Error('User ID is required');
  const response = await fetch(`${BASE_URL}/user/${userId}/details`);

  if (!response.ok) throw new Error('Failed to fetch user details');

  return response.json();
}

// User followers
export async function getUserFollowers(
  userId: string,
  skip?: number,
  limit?: number,
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/user/${userId}/followers?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user followers');

  return response.json();
}

// User following
export async function getUserFollowing(
  userId: string,
  skip?: number,
  limit?: number,
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/user/${userId}/following?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user following');

  return response.json();
}

// User friends
export async function getUserFriends(
  userId: string,
  skip?: number,
  limit?: number,
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/user/${userId}/friends?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user friends');

  return response.json();
}

// User muted
export async function getUserMuted(
  userId: string,
  skip?: number,
  limit?: number,
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(
    `${BASE_URL}/user/${userId}/muted?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user muted');

  return response.json();
}

// User relationship
export async function getUserRelationship(
  userId: string,
  viewerId: string,
): Promise<Relationship> {
  const response = await fetch(
    `${BASE_URL}/user/${userId}/relationship/${viewerId}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user relationship');

  return response.json();
}

// User label taggers
export async function getUserTaggers(
  userId: string,
  tagName: string,
  skip?: number,
  limit?: number,
): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  const response = await fetch(
    `${BASE_URL}/user/${userId}/taggers/${tagName}?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user tags');

  return response.json();
}

// User tags
export async function getUserTags(
  userId: string,
  limitTags?: number,
  limitTaggers?: number,
): Promise<UserTag[]> {
  const queryParams = new URLSearchParams();

  if (limitTags !== undefined) {
    queryParams.append('limit_tags', String(limitTags));
  }
  if (limitTaggers !== undefined) {
    queryParams.append('limit_taggers', String(limitTaggers));
  }
  const response = await fetch(
    `${BASE_URL}/user/${userId}/tags?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user tags');

  return response.json();
}

// Get user notifications
export async function getUserNotifications(
  userId: string,
  start?: number,
  end?: number,
  skip?: number,
  limit?: number,
): Promise<any> {
  const queryParams = new URLSearchParams();

  if (start !== undefined) {
    queryParams.append('start', String(start));
  }
  if (end !== undefined) {
    queryParams.append('end', String(end));
  }
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  const response = await fetch(
    `${BASE_URL}/user/${userId}/notifications?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch notifications');

  const fileData = await response.json();
  return fileData;
}

// Post tags taggers
export async function getPostTagTaggers(
  userId: string,
  postId: string,
  tagName: string,
  viewerId?: string,
  skip?: number,
  limit?: number,
): Promise<Taggers> {
  const queryParams = new URLSearchParams();

  if (viewerId) queryParams.append('viewer_id', viewerId);
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  const response = await fetch(
    `${BASE_URL}/post/${userId}/${postId}/taggers/${tagName}?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch post tags taggers');

  return response.json();
}

// User tags taggers
export async function getUserTagTaggers(
  userId: string,
  tagName: string,
  viewerId?: string,
  skip?: number,
  limit?: number,
): Promise<Taggers> {
  const queryParams = new URLSearchParams();

  if (viewerId) queryParams.append('viewer_id', viewerId);
  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  const response = await fetch(
    `${BASE_URL}/user/${userId}/taggers/${tagName}?${queryParams}`,
  );

  if (!response.ok) throw new Error('Failed to fetch user tags taggers');

  return response.json();
}
