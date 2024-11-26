'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getStreamPosts,
  getUserStream,
  searchUsersByUsername,
} from '@/services/streamService';

export function useStreamPost(
  source: string,
  userId: string,
  viewerId?: string,
  limit?: number,
  start?: number,
  end?: number,
  skip?: number,
  sort?: 'recent' | 'popularity',
  tags?: string[]
) {
  return useQuery({
    queryKey: [
      `${source}-postStream`,
      source,
      userId,
      viewerId,
      limit,
      start,
      end,
      skip,
      sort,
      tags,
    ],
    queryFn: () =>
      getStreamPosts(
        source,
        userId,
        viewerId,
        limit,
        start,
        end,
        skip,
        sort,
        tags
      ),
    retry: false,
  });
}

export function useStreamUsers(
  userId: string,
  viewerId: string,
  source: string, // 'following', 'followers', 'friends', 'muted' and 'recommended'
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['streamUsers', userId, viewerId, source, skip, limit],
    queryFn: () => getUserStream(userId, viewerId, source, skip, limit),
    retry: false,
  });
}

export function useStreamSearchUsersByUsername(
  username: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['streamSearchUsersByUsername', username, viewerId, skip, limit],
    queryFn: () => searchUsersByUsername(username, viewerId, skip, limit),
    retry: false,
  });
}
