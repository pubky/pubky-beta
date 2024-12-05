'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getHotTags,
  getTagsByReach,
  getTagTaggers,
} from '../services/tagService';

export function useHotTags(skip?: number, limit?: number, maxTaggers?: number) {
  return useQuery({
    queryKey: ['hotTags', skip, limit, maxTaggers],
    queryFn: () => getHotTags(skip, limit, maxTaggers),
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
