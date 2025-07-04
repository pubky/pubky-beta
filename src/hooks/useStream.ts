'use client';

import { useQuery } from '@tanstack/react-query';
import { getStreamPosts, getUserStream } from '@/services/streamService';
import { TContent, TReach, TSort, TSource, TSourceUser, TTimeframe } from '@/types';

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
  kind?: TContent,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: [
      source ? `${source}-streamPost` : 'streamPost',
      viewerId,
      source,
      authorId,
      limit,
      start,
      end,
      skip,
      sort,
      tags,
      kind
    ],
    queryFn: () =>
      getStreamPosts(
        viewerId,
        source,
        authorId,
        limit,
        sort === 'recent' ? start : undefined,
        end,
        sort === 'popularity' ? skip : undefined,
        sort,
        tags,
        kind
      ),
    retry: false,
    ...options
  });
}

export function useStreamUsers(
  userId?: string,
  viewerId?: string,
  source?: TSourceUser,
  skip?: number,
  limit?: number,
  reach?: TReach,
  timeframe?: TTimeframe
) {
  return useQuery({
    queryKey: [source ? `${source}-streamUser` : 'streamUser', userId, viewerId, source, reach, timeframe, skip, limit],
    queryFn: () => getUserStream(userId, viewerId, source, reach, timeframe, skip, limit),
    retry: false
  });
}
