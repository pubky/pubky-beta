import { TContent, TReach, TSort, TSource, TSourceUser, TTimeframe } from '@/types';
import { PostView } from '@/types/Post';
import { UserView } from '@/types/User';

const NEXT_PUBLIC_NEXUS = process.env.NEXT_PUBLIC_NEXUS;
const BASE_URL = `${NEXT_PUBLIC_NEXUS}/v0`;

export async function getStreamPosts(
  viewerId: string,
  source?: TSource,
  authorId?: string,
  limit?: number,
  start?: number,
  end?: number,
  skip?: number,
  sort?: TSort,
  tags?: string[],
  kind?: TContent
): Promise<PostView[]> {
  const queryParams = new URLSearchParams();

  if (authorId) {
    queryParams.append('author_id', authorId);
  }

  const validatedSource = validateSourceParams(source, {
    authorId,
    viewerId,
    postId: ''
  });

  if (validatedSource) {
    queryParams.append('source', validatedSource);
  } else {
    queryParams.append('source', 'all');
  }

  if (viewerId) {
    queryParams.append('viewer_id', viewerId);
    queryParams.append('observer_id', viewerId);
  }

  if (sort) {
    if (sort === 'recent') {
      queryParams.append('sorting', 'timeline');
      if (start !== undefined) {
        queryParams.append('start', String(start));
      }
      if (end !== undefined) {
        queryParams.append('end', String(end));
      }
      if (limit !== undefined) {
        queryParams.append('limit', String(limit));
      }
      if (skip !== undefined) {
        queryParams.append('skip', String(skip));
      }
    } else if (sort === 'popularity') {
      queryParams.append('sorting', 'total_engagement');
      if (skip !== undefined) {
        queryParams.append('skip', String(skip));
      }
      if (limit !== undefined) {
        queryParams.append('limit', String(limit));
      }
    }
  } else {
    if (start !== undefined) {
      queryParams.append('start', String(start));
    }
    if (end !== undefined) {
      queryParams.append('end', String(end));
    }
    if (limit !== undefined) {
      queryParams.append('limit', String(limit));
    }
  }

  if (tags) {
    queryParams.append('tags', String(tags));
  }

  if (kind !== undefined && kind !== 'all') {
    const kindTypeMap = {
      posts: 'short',
      articles: 'long',
      images: 'image',
      videos: 'video',
      links: 'link',
      files: 'file'
    };

    const kindType = kindTypeMap[kind] || kind;

    queryParams.append('kind', String(kindType));
  }

  const response = await fetch(`${BASE_URL}/stream/posts?${queryParams.toString()}`);

  if (!response.ok) throw new Error('Failed to fetch post stream.');

  return response.json();
}

function validateSourceParams(source: TSource | undefined, params: { [key: string]: any }) {
  switch (source) {
    case 'following':
    case 'followers':
    case 'friends':
    case 'bookmarks':
      if (!params.viewerId) {
        console.warn(`Source ${source} requires viewerId. Defaulting to 'all'.`);
        return 'all';
      }
      break;
    case 'post_replies':
      if (!params.authorId || !params.postId) {
        console.warn(`Source ${source} requires authorId and postId. Defaulting to 'all'.`);
        return 'all';
      }
      break;
    case 'author':
    case 'author_replies':
      if (!params.authorId) {
        console.warn(`Source ${source} requires authorId. Defaulting to 'all'.`);
        return 'all';
      }
      break;
  }
  return source;
}

// Get stream users
export async function getUserStream(
  userId?: string,
  viewerId?: string,
  source?: TSourceUser,
  reach?: TReach,
  timeframe?: TTimeframe,
  skip?: number,
  limit?: number
): Promise<UserView[]> {
  const queryParams = new URLSearchParams();

  if (userId !== undefined) {
    queryParams.append('user_id', String(userId));
  }

  if (viewerId !== undefined) {
    queryParams.append('viewer_id', String(viewerId));
  }

  if (source !== undefined) {
    queryParams.append('source', String(source));
  }

  if (userId?.trim() && reach?.trim() && reach !== 'all') {
    queryParams.append('reach', String(reach));
  }

  if (timeframe !== undefined && timeframe !== 'all_time') {
    queryParams.append('timeframe', String(timeframe));
  }

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  // We cannot add user_id to the query if not we request user WoT active users
  if (reach?.trim() == 'all' && source?.trim() == 'influencers') {
    queryParams.delete('user_id');
  }

  const response = await fetch(`${BASE_URL}/stream/users?${queryParams}`);

  if (!response.ok) throw new Error(`Failed to fetch user ${source}`);

  return response.json();
}

export async function searchUsersById(prefix: string, skip?: number, limit?: number): Promise<string[]> {
  try {
    if (!prefix) throw new Error('Prefix is required');

    const queryParams = new URLSearchParams();
    if (skip !== undefined) queryParams.append('skip', String(skip));
    if (limit !== undefined) queryParams.append('limit', String(limit));

    const response = await fetch(`${BASE_URL}/search/users/by_id/${prefix}?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to search users by id: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) return [];

    return JSON.parse(text);
  } catch (error) {
    console.error('Error in searchUsersById:', error);
    return [];
  }
}

export async function searchUsersByName(prefix: string, skip?: number, limit?: number): Promise<string[]> {
  try {
    if (!prefix) throw new Error('Prefix is required');

    const queryParams = new URLSearchParams();
    if (skip !== undefined) queryParams.append('skip', String(skip));
    if (limit !== undefined) queryParams.append('limit', String(limit));

    const response = await fetch(`${BASE_URL}/search/users/by_name/${prefix}?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to search users by username: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) return [];

    return JSON.parse(text);
  } catch (error) {
    console.error('Error in searchUsersByName:', error);
    return [];
  }
}

// Search tags by prefix
export async function searchTagsByPrefix(prefix: string, skip?: number, limit?: number): Promise<string[]> {
  const queryParams = new URLSearchParams();

  if (skip !== undefined) {
    queryParams.append('skip', String(skip));
  }
  if (limit !== undefined) {
    queryParams.append('limit', String(limit));
  }

  const response = await fetch(`${BASE_URL}/search/tags/by_prefix/${prefix}?${queryParams}`);

  if (!response.ok) throw new Error('Failed to search tags');

  return response.json();
}
