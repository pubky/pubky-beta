import { HotTag, TagsByReach, Taggers } from '../types/Tag';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

// Get global hot tags
export async function getHotTags(
  skip?: number,
  limit?: number,
  maxTaggers?: number,
): Promise<HotTag[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }
  if (maxTaggers) {
    queryParams.append('max_taggers', String(maxTaggers));
  }
  const response = await fetch(`${BASE_URL}/tags/hot?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch hot tags');
  return response.json();
}

// Get global tags by reach
export async function getTagsByReach(
  userId: string,
  reach: string, // follower | following | friends
): Promise<TagsByReach> {
  const response = await fetch(`${BASE_URL}/tag/reached/${userId}/${reach}`);
  if (!response.ok) throw new Error('Failed to fetch tags by reach');
  return response.json();
}

// Get global tags by taggers
export async function getTagTaggers(
  label: string,
  reach: string, // follower | following | friends
): Promise<Taggers> {
  const response = await fetch(`${BASE_URL}/tag/taggers/${label}/${reach}`);
  if (!response.ok) throw new Error('Failed to fetch tag taggers');
  return response.json();
}
