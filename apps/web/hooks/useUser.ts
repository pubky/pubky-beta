'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getUserProfile,
  searchUsers,
  searchUsersByUsername,
  getUserStream,
  getUserList,
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

export function UseUserStream(
  userId: string,
  viewerId: string,
  source:
    | 'followers'
    | 'following'
    | 'friends'
    | 'muted'
    | 'most_followed'
    | 'pioneers',
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['userStream', userId, viewerId, source, skip, limit],
    queryFn: () => getUserStream(userId, viewerId, source, skip, limit),
    retry: false,
  });
}

export function UseUserList(
  userId: string,
  source:
    | 'followers'
    | 'following'
    | 'friends'
    | 'muted'
    | 'most_followed'
    | 'pioneers',
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['userList', userId, source, skip, limit],
    queryFn: () => getUserList(userId, source, skip, limit),
    retry: false,
  });
}

export function useSearchUsers(
  username: string,
  skip?: number,
  limit?: number
) {
  return useQuery({
    queryKey: ['searchUsers', username, skip, limit],
    queryFn: () => searchUsers(username, skip, limit),
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
