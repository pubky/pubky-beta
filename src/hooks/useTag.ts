'use client';

import { useQuery } from '@tanstack/react-query';
import { getHotTags, getTagsByReach, getTagsPost, getTagsUser, getTagTaggers } from '../services/tagService';

export function useHotTags(
  userId?: string,
  reach?: string,
  skip?: number,
  limit?: number,
  maxTaggers?: number,
  timeframe?: string
) {
  return useQuery({
    queryKey: ['hotTags', userId, reach, skip, limit, maxTaggers, timeframe],
    queryFn: () => getHotTags(userId, reach, skip, limit, maxTaggers, timeframe),
    retry: false
  });
}

export function useTagsByReach(userId: string, reach: string) {
  return useQuery({
    queryKey: ['tagsByReach', userId, reach],
    queryFn: () => getTagsByReach(userId, reach),
    retry: false
  });
}

export function useTagTaggers(label: string, reach: string) {
  return useQuery({
    queryKey: ['tagTaggers', label, reach],
    queryFn: () => getTagTaggers(label, reach),
    retry: false
  });
}

export function useTagsPost(
  userId: string,
  postId: string,
  viewerId?: string,
  skip?: number,
  limit?: number,
  maxTaggers?: number
) {
  return useQuery({
    queryKey: ['tagsPost', userId, postId, viewerId, skip, limit, maxTaggers],
    queryFn: () => getTagsPost(userId, postId, viewerId, skip, limit, maxTaggers),
    retry: false
  });
}

export function useTagsUser(userId: string, viewerId?: string, skip?: number, limit?: number, maxTaggers?: number) {
  const isEnabled = Boolean(userId?.trim());

  return useQuery({
    queryKey: ['tagsUser', userId, viewerId, skip, limit, maxTaggers],
    queryFn: () => getTagsUser(userId!, viewerId, skip, limit, maxTaggers),
    // control the execution of the query. userId has to have value
    enabled: isEnabled,
    retry: false
  });
}
