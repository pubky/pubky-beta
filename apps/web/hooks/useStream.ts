'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getStreamPosts,
  getUserStream,
  searchUsersByUsername,
} from '@/services/streamService';
import { TSort, TSource, TSourceUser } from '@/types';

export function useStreamPost(
  viewerId: string,
  source?: TSource,
  authorId?: string,
  limit?: number,
  start?: number,
  end?: number,
  skip?: number,
  sort?: TSort,
  tags?: string[],
) {
  return useQuery({
    queryKey: [
      source ? `${source}-streamPost` : 'streamPost',
      viewerId,
      authorId,
      source,
      limit,
      start,
      end,
      skip,
      sort,
      tags,
    ],
    queryFn: () =>
      getStreamPosts(
        viewerId,
        source,
        authorId,
        limit,
        start,
        end,
        skip,
        sort,
        tags,
      ),
    retry: false,
  });
}

export function useStreamUsers(
  userId: string,
  viewerId: string,
  source: TSourceUser,
  skip?: number,
  limit?: number,
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
  limit?: number,
) {
  return useQuery({
    queryKey: ['streamSearchUsersByUsername', username, viewerId, skip, limit],
    queryFn: () => searchUsersByUsername(username, viewerId, skip, limit),
    retry: false,
  });
}
