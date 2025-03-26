'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getPost,
  getPostDetails,
  getPostCounts,
  getPostBookmark,
  getPostReplies,
  getPostByTaggers,
  getPostByTags
} from '../services/postService';

export function usePost(authorId: string, postId: string, viewerId?: string, maxTags?: number, maxTaggers?: number) {
  const isEnabled = Boolean(authorId?.trim() && postId?.trim());
  return useQuery({
    queryKey: ['post', authorId, postId, viewerId, maxTags, maxTaggers],
    queryFn: () => getPost(authorId, postId, viewerId, maxTags, maxTaggers),
    enabled: isEnabled,
    retry: false
  });
}

export function usePostBookmark(authorId: string, postId: string, viewerId?: string) {
  return useQuery({
    queryKey: ['postBookmark', authorId, postId, viewerId],
    queryFn: () => getPostBookmark(authorId, postId, viewerId),
    retry: false
  });
}

export function usePostCounts(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postCounts', authorId, postId],
    queryFn: () => getPostCounts(authorId, postId),
    retry: false
  });
}

export function usePostDetails(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postDetails', authorId, postId],
    queryFn: () => getPostDetails(authorId, postId),
    retry: false
  });
}

export function usePostReplies(
  authorId: string,
  postId: string,
  viewerId?: string,
  skip?: number,
  limit?: number,
  start?: number,
  end?: number,
  order?: 'ascending' | 'descending',
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useQuery({
    queryKey: ['postReplies', authorId, postId, viewerId, limit, start, end, skip, order],
    queryFn: () => getPostReplies(authorId, postId, viewerId, limit, start, end, skip, order),
    retry: false,
    ...options
  });
}

export function usePostTaggers(authorId: string, postId: string, label: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['postTaggers', authorId, postId, label, skip, limit],
    queryFn: () => getPostByTaggers(authorId, postId, label, skip, limit),
    retry: false
  });
}

export function usePostTags(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postTags', authorId, postId],
    queryFn: () => getPostByTags(authorId, postId),
    retry: false
  });
}
