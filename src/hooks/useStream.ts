'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getStreamPosts, getUserStream, searchUsersByUsername } from '@/services/streamService';
import { TContent, TSort, TSource, TSourceUser } from '@/types';

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
  options?: UseQueryOptions<unknown, Error>
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
    ...options,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false
  });
}

export function useStreamUsers(userId: string, viewerId: string, source: TSourceUser, skip?: number, limit?: number) {
  return useQuery({
    queryKey: [source ? `${source}-streamUser` : 'streamUser', userId, viewerId, source, skip, limit],
    queryFn: () => getUserStream(userId, viewerId, source, skip, limit),
    retry: false
  });
}

export function useStreamSearchUsersByUsername(username: string, viewerId?: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['streamSearchUsersByUsername', username, viewerId, skip, limit],
    queryFn: () => searchUsersByUsername(username, viewerId, skip, limit),
    retry: false
  });
}
