'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getUserProfile,
  getUserCounts,
  getUserFollowers,
  getUserFollowing,
  getUserFriends,
  getUserRelationship,
  searchUsers,
  getUserStream,
  getMostFollowedUsers,
  getInfluencersUsers,
  getUserTags,
  searchUsersByUsername,
  getUserStreamFollowers,
  getUserStreamFollowing,
  getUserStreamFriends,
  getUserStreamMuted,
  getUserMuted,
  getRecommendedUsers,
} from '../services/userService';
import { getNotifications } from '@/services/notificationService';

export function useUserProfile(userId: string, viewerId: string) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId, viewerId),
    initialData: null,
    retry: false,
  });
}

export function useUserCounts(userId: string) {
  return useQuery({
    queryKey: ['userCounts', userId],
    queryFn: () => getUserCounts(userId),
    retry: false,
  });
}

export function UseUserStreamFollowers(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
) {
  return useQuery({
    queryKey: ['userStreamFollowers', userId, viewerId, skip, limit, source],
    queryFn: () =>
      getUserStreamFollowers(userId, viewerId, skip, limit, source),
    retry: false,
  });
}

export function UseUserStreamFollowing(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
) {
  return useQuery({
    queryKey: ['userStreamFollowing', userId, viewerId, skip, limit, source],
    queryFn: () =>
      getUserStreamFollowing(userId, viewerId, skip, limit, source),
    retry: false,
  });
}

export function UseUserStreamFriends(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
) {
  return useQuery({
    queryKey: ['userStreamFriends', userId, viewerId, skip, limit, source],
    queryFn: () => getUserStreamFriends(userId, viewerId, skip, limit, source),
    retry: false,
  });
}

export function UseUserStreamMuted(
  userId: string,
  viewerId: string,
  skip?: number,
  limit?: number,
  source?: string
) {
  return useQuery({
    queryKey: ['userStreamMuted', userId, viewerId, skip, limit, source],
    queryFn: () => getUserStreamMuted(userId, viewerId, skip, limit, source),
    retry: false,
  });
}

export function UseUserFollowers(
  userId: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['userFollowers', userId, skip, limit],
    queryFn: () => getUserFollowers(userId, skip, limit),
    retry: false,
  });
}

export function UseUserFollowing(
  userId: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['userFollowing', userId, skip, limit],
    queryFn: () => getUserFollowing(userId, skip, limit),
    retry: false,
  });
}

export function UseUserFriends(userId: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userFriends', userId, skip, limit],
    queryFn: () => getUserFriends(userId, skip, limit),
    retry: false,
  });
}

export function UseUserMuted(userId: string, skip?: number, limit?: number) {
  return useQuery({
    queryKey: ['userMuted', userId, skip, limit],
    queryFn: () => getUserMuted(userId, skip, limit),
    retry: false,
  });
}

export function useUserRelationship(userId: string, viewerId: string) {
  return useQuery({
    queryKey: ['userRelationship', userId, viewerId],
    queryFn: () => getUserRelationship(userId, viewerId),
    retry: false,
  });
}

export function useSearchUsers(
  username?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['searchUsers', username, skip, limit],
    queryFn: () => searchUsers(username, skip, limit),
    retry: false,
  });
}

export function useUserStream(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number,
  source?: string
) {
  return useQuery({
    queryKey: ['userStream', userId, viewerId, skip, limit, source],
    queryFn: () => getUserStream(userId, viewerId, skip, limit, source),
    retry: false,
  });
}

export function useMostFollowedUsers(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['mostFollowedUsers', viewerId, skip, limit],
    queryFn: () => getMostFollowedUsers(userId, viewerId, skip, limit),
    retry: false,
  });
}

export function useRecommendedUsers(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['recommendedUsers', viewerId, skip, limit],
    queryFn: () => getRecommendedUsers(userId, viewerId, skip, limit),
    retry: false,
  });
}

export function useInfluencersUsers(
  userId: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['influencersUsers', viewerId, skip, limit],
    queryFn: () => getInfluencersUsers(userId, viewerId, skip, limit),
    retry: false,
  });
}

export function useUserTags(userId: string) {
  return useQuery({
    queryKey: ['userTags', userId],
    queryFn: () => getUserTags(userId),
    retry: false,
  });
}

export function useUsernameSearch(
  username: string,
  viewerId?: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['usernameSearch', username, viewerId, skip, limit],
    queryFn: () => searchUsersByUsername(username, viewerId, skip, limit),
    retry: false,
  });
}

export function useUserNotifications(userId: string) {
  return useQuery({
    queryKey: ['userNotifications', userId],
    queryFn: () => getNotifications(userId),
    retry: false,
  });
}
