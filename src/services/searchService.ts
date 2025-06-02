import { UserSearch } from '@/types/User';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

// Search posts by tags
export async function searchPostsByTags(
  label: string,
  sorting?: string,
  start?: number,
  end?: number,
  skip?: number,
  limit?: number
): Promise<UserSearch> {
  const queryParams = new URLSearchParams();

  if (sorting !== undefined) {
    queryParams.append('sorting', String(sorting));
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
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(`${BASE_URL}/search/posts/by_tag/${label}?${queryParams}`);

  if (!response.ok) throw new Error('Failed to search users');

  return response.json();
}

// Search user id by username
export async function searchUsers(username: string, skip?: number, limit?: number): Promise<UserSearch> {
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
