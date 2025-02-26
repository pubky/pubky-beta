'use client';

import { useQuery } from '@tanstack/react-query';
import { searchPostsByTags, searchUsers } from '@/services/searchService';

export function useSearchPostsByTags(
  label: string,
  sorting?: string,
  start?: number,
  end?: number,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['searchPostsByTags', label, sorting, start, end, skip, limit],
    queryFn: () => searchPostsByTags(label, sorting, start, end, skip, limit),
    retry: false
  });
}

export function useSearchUsers(username: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['searchUsers', username, skip, limit],
    queryFn: () => searchUsers(username, skip, limit),
    retry: false
  });
}
