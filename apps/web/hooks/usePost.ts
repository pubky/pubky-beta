'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getPost,
  getPostDetails,
  getPostCounts,
  getPostBookmark,
  getPostStream,
  getPostStreamByReach,
  getPostReplies,
  getBookmarkedPosts,
  getStreamPosts,
} from '../services/postService';

export function usePost(authorId: string, postId: string, viewerId?: string) {
  return useQuery({
    queryKey: ['post', authorId, postId, viewerId],
    queryFn: () => getPost(authorId, postId, viewerId),
    retry: false,
  });
}

export function usePostDetails(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postDetails', authorId, postId],
    queryFn: () => getPostDetails(authorId, postId),
    retry: false,
  });
}

export function usePostCounts(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postCounts', authorId, postId],
    queryFn: () => getPostCounts(authorId, postId),
    retry: false,
  });
}

export function usePostBookmark(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postBookmark', authorId, postId],
    queryFn: () => getPostBookmark(authorId, postId),
    retry: false,
  });
}

export function usePostStream(
  viewerId?: string,
  skip?: number,
  limit?: number,
  reach?: 'following' | 'friends' | 'followers' | 'all',
  sort?: 'recent' | 'popularity',
  tags?: string[]
) {
  return useQuery({
    queryKey: ['postStream', viewerId, skip, limit, reach, sort, tags],
    queryFn: () => getPostStream(viewerId, skip, limit, reach, sort, tags),
    retry: false,
  });
}

export function usePostStreamByUser(
  userId: string,
  viewerId?: string,
  limit?: number,
  start?: number,
  end?: number,
  skip?: number
) {
  return useQuery({
    queryKey: ['postStreamByUser', userId, viewerId, limit, start, end, skip],
    queryFn: () =>
      getStreamPosts('author', userId, viewerId, limit, start, end, skip),
    retry: false,
  });
}

export function useRepliesStreamByUser(
  userId: string,
  viewerId?: string,
  limit?: number,
  start?: number,
  end?: number,
  skip?: number
) {
  return useQuery({
    queryKey: [
      'repliesStreamByUser',
      userId,
      viewerId,
      limit,
      start,
      end,
      skip,
    ],
    queryFn: () =>
      getStreamPosts(
        'author_replies',
        userId,
        viewerId,
        limit,
        start,
        end,
        skip
      ),
    retry: false,
  });
}

export function usePostStreamByReach(
  viewerId: string,
  reach: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['postStreamByReach', viewerId, reach, skip, limit],
    queryFn: () => getPostStreamByReach(viewerId, reach, skip, limit),
    retry: false,
  });
}

export function usePostReplies(
  authorId: string,
  postId: string,
  viewerId?: string,
  skip?: number,
  limit?: number,
  start?: number,
  end?: number
) {
  return useQuery({
    queryKey: [
      'postReplies',
      authorId,
      postId,
      viewerId,
      limit,
      start,
      end,
      skip,
    ],
    queryFn: () =>
      getPostReplies(authorId, postId, viewerId, limit, start, end, skip),
    retry: false,
  });
}

export function useBookmarkedPosts(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['bookmarkedPosts', userId, viewerId, skip, limit],
    queryFn: () => getBookmarkedPosts(userId, viewerId, skip, limit),
    retry: false,
  });
}
