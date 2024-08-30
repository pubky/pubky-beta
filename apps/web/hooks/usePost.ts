'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getPost,
  getPostDetails,
  getPostCounts,
  getPostBookmark,
  getPostStream,
  getPostStreamByUser,
  getPostStreamByReach,
  getPostThread,
  getBookmarkedPosts,
} from '../services/postService';

export function usePost(authorId: string, postId: string, viewerId?: string) {
  return useQuery({
    queryKey: ['post', authorId, postId, viewerId],
    queryFn: () => getPost(authorId, postId, viewerId),
  });
}

export function usePostDetails(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postDetails', authorId, postId],
    queryFn: () => getPostDetails(authorId, postId),
  });
}

export function usePostCounts(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postCounts', authorId, postId],
    queryFn: () => getPostCounts(authorId, postId),
  });
}

export function usePostBookmark(authorId: string, postId: string) {
  return useQuery({
    queryKey: ['postBookmark', authorId, postId],
    queryFn: () => getPostBookmark(authorId, postId),
  });
}

export function usePostStream(
  viewerId?: string,
  skip?: number,
  limit?: number,
  sorting?: string
) {
  return useQuery({
    queryKey: ['postStream', viewerId, skip, limit, sorting],
    queryFn: () => getPostStream(viewerId, skip, limit, sorting),
  });
}

export function usePostStreamByUser(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['postStreamByUser', userId, viewerId, skip, limit],
    queryFn: () => getPostStreamByUser(userId, viewerId, skip, limit),
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
  });
}

export function usePostThread(
  authorId: string,
  postId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['postThread', authorId, postId, viewerId, skip, limit],
    queryFn: () => getPostThread(authorId, postId, viewerId, skip, limit),
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
  });
}
