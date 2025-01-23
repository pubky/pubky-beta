'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getHotTags,
  getTagsByReach,
  getTagTaggers,
} from '../services/tagService';

export function useHotTags(
  userId?: string,
  reach?: string,
  skip?: number,
  limit?: number,
  maxTaggers?: number,
  timeframe?: string,
) {
  return useQuery({
    queryKey: ['hotTags', userId, reach, skip, limit, maxTaggers, timeframe],
    queryFn: () => getHotTags(userId, reach, skip, limit, maxTaggers, timeframe),
    retry: false,
  });
}

export function useTagsByReach(userId: string, reach: string) {
  return useQuery({
    queryKey: ['tagsByReach', userId, reach],
    queryFn: () => getTagsByReach(userId, reach),
    retry: false,
  });
}

export function useTagTaggers(label: string, reach: string) {
  return useQuery({
    queryKey: ['tagTaggers', label, reach],
    queryFn: () => getTagTaggers(label, reach),
    retry: false,
  });
}
