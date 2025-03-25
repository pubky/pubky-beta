'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getUserProfile,
  getUserCounts,
  getUserFollowers,
  getUserFollowing,
  getUserFriends,
  getUserRelationship,
  getUserTags,
  getUserMuted,
  getUserDetails,
  getUserTaggers,
  getUserNotifications,
  getPostTagTaggers,
  getUserTagTaggers
} from '../services/userService';

export function useUserProfile(userId: string, viewerId: string) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId, viewerId),
    initialData: null,
    retry: false
  });
}

export function useUserCounts(userId: string) {
  return useQuery({
    queryKey: ['userCounts', userId],
    queryFn: () => getUserCounts(userId),
    retry: false
  });
}

export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: ['userDetails', userId],
    queryFn: () => getUserDetails(userId),
    retry: false
  });
}

export function UseUserFollowers(userId: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userFollowers', userId, skip, limit],
    queryFn: () => getUserFollowers(userId, skip, limit),
    retry: false
  });
}

export function UseUserFollowing(userId: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userFollowing', userId, skip, limit],
    queryFn: () => getUserFollowing(userId, skip, limit),
    retry: false
  });
}

export function UseUserFriends(userId: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userFriends', userId, skip, limit],
    queryFn: () => getUserFriends(userId, skip, limit),
    retry: false
  });
}

export function UseUserMuted(userId: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userMuted', userId, skip, limit],
    queryFn: () => getUserMuted(userId, skip, limit),
    retry: false
  });
}

export function useUserRelationship(userId: string, viewerId: string) {
  return useQuery({
    queryKey: ['userRelationship', userId, viewerId],
    queryFn: () => getUserRelationship(userId, viewerId),
    retry: false
  });
}

export function useUserTaggers(userId: string, tagName: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userTaggers', userId, tagName, skip, limit],
    queryFn: () => getUserTaggers(userId, tagName, skip, limit),
    retry: false
  });
}

export function useUserTags(userId: string, limitTags?: number, limitTaggers?: number) {
  return useQuery({
    queryKey: ['userTaggers', userId, limitTags, limitTaggers],
    queryFn: () => getUserTags(userId, limitTags, limitTaggers),
    retry: false
  });
}

export function useUserNotifications(userId: string, start?: number, end?: number, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userNotifications', userId, start, end, skip, limit],
    queryFn: () => getUserNotifications(userId, start, end, skip, limit),
    retry: false,
    refetchInterval: 30000
  });
}

export function usePostTagTaggers(
  userId: string,
  postId: string,
  tagName: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['postTagTaggers', userId, postId, tagName, viewerId, skip, limit],
    queryFn: () => getPostTagTaggers(userId, postId, tagName, viewerId, skip, limit),
    retry: false
  });
}

export function useUserTagTaggers(userId: string, tagName: string, viewerId?: string, skip?: number, limit?: number) {
  const isEnabled = Boolean(userId?.trim() && tagName?.trim());

  return useQuery({
    queryKey: ['userTagTaggers', userId, tagName, viewerId, skip, limit],
    queryFn: () => getUserTagTaggers(userId!, tagName!, viewerId, skip, limit),
    // control the execution of the query. userId and tagName has to have value
    enabled: isEnabled,
    retry: false
  });
}
