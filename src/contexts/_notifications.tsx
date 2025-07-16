'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { BodyNotification, NotificationView, UserView } from '@/types/User';
import { useUserNotifications } from '@/hooks/useUser';
import { getUserNotifications } from '@/services/userService';
import { NotificationPreferences } from '@/types';
import { defaultPreferences } from './_filters';
import { getUserProfile } from '@/services/userService';

type NotificationsContextType = {
  notifications: NotificationView[];
  loading: boolean;
  profilesLoading: boolean;
  userProfilesCache: { [userId: string]: UserView | null };
  fetchNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  applySettings: () => Promise<void>;
  preloadUserProfiles: (userIds: string[]) => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  loading: true,
  profilesLoading: true,
  userProfilesCache: {},
  fetchNotifications: async () => {},
  loadMoreNotifications: async () => {},
  applySettings: async () => {},
  preloadUserProfiles: async () => {}
});

export function NotificationsWrapper({ children }: { children: ReactNode }) {
  const { pubky, timestamp, loadSettings, mutedUsers, getTimestampNotification, setTimestamp } =
    usePubkyClientContext();
  const { setUnReadNotification } = useFilterContext();

  const limit = 30;
  const [skip, setSkip] = useState(0);
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(false);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [userProfilesCache, setUserProfilesCache] = useState<{ [userId: string]: UserView | null }>({});
  const [hasMore, setHasMore] = useState(true);
  const [prevPubky, setPrevPubky] = useState<string | null>(null);
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState<number>(0);
  const [timestampLoaded, setTimestampLoaded] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState<NotificationPreferences | null>(null);
  const { data: initNotifications, isLoading } = useUserNotifications(pubky ?? '', undefined, undefined, skip, limit);

  // Extract unique user IDs from notifications
  const extractUserIdsFromNotifications = useCallback((notifications: NotificationView[]): string[] => {
    const userIds = new Set<string>();

    notifications.forEach((notification) => {
      const senderPubky = extractSenderPubky(notification.body);
      if (senderPubky) {
        userIds.add(senderPubky);
      }
    });

    return Array.from(userIds);
  }, []);

  // Preload user profiles for given user IDs
  const preloadUserProfiles = useCallback(
    async (userIds: string[]) => {
      if (!pubky || userIds.length === 0) return;

      setProfilesLoading(true);

      try {
        const uniqueUserIds = userIds.filter((userId) => !userProfilesCache.hasOwnProperty(userId));

        if (uniqueUserIds.length === 0) {
          setProfilesLoading(false);
          return;
        }

        // Fetch profiles in parallel with a limit to avoid overwhelming the API
        const batchSize = 5;
        const batches = [];

        for (let i = 0; i < uniqueUserIds.length; i += batchSize) {
          batches.push(uniqueUserIds.slice(i, i + batchSize));
        }

        for (const batch of batches) {
          const profilePromises = batch.map(async (userId) => {
            try {
              const profile = await getUserProfile(userId, pubky);
              return { userId, profile };
            } catch (error) {
              console.error(`Error fetching profile for ${userId}:`, error);
              return { userId, profile: null };
            }
          });

          const results = await Promise.all(profilePromises);

          setUserProfilesCache((prevCache) => {
            const newCache = { ...prevCache };
            results.forEach(({ userId, profile }) => {
              newCache[userId] = profile;
            });
            return newCache;
          });

          // Small delay between batches to be respectful to the API
          if (batches.length > 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      } catch (error) {
        console.error('Error preloading user profiles:', error);
      } finally {
        setProfilesLoading(false);
      }
    },
    [pubky, userProfilesCache]
  );

  const checkSettings = async () => {
    if (pubky === undefined) return;

    try {
      const result = await loadSettings();
      if (result?.notifications) {
        setPreferencesLoaded(result.notifications);
      } else {
        setPreferencesLoaded(defaultPreferences);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const applySettings = async () => {
    // Reset notification states
    setNotifications([]);
    setSkip(0);
    setHasMore(true);
    setTimestampLoaded(false);
    setPreferencesLoaded(null);

    // Reload settings
    await checkSettings();

    // Reload timestamp
    if (pubky) {
      try {
        const lastTimestamp = await getTimestampNotification();
        setTimestamp(lastTimestamp);
        setTimestampLoaded(true);
      } catch (error) {
        console.warn('Error loading timestamp:', error);
        setTimestampLoaded(true);
      }
    }
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Load settings when pubky is available
  useEffect(() => {
    if (pubky) {
      checkSettings();
    }
  }, [pubky, loadSettings]);

  useEffect(() => {
    const fetchTimestamp = async () => {
      if (pubky && timestamp <= 0) {
        try {
          const lastTimestamp = await getTimestampNotification();
          setTimestamp(lastTimestamp);
          setTimestampLoaded(true);
        } catch (error) {
          console.warn('Error loading timestamp:', error);
          setTimestampLoaded(true); // Set to true even on error to prevent infinite loading
        }
      }
    };

    fetchTimestamp();
  }, [pubky, timestamp, getTimestampNotification, setTimestamp]);

  const filterNotifications = (notifications: NotificationView[]) => {
    // First filter out muted users and disabled notification types
    const filtered = notifications.filter((notification) => {
      const senderPubky = extractSenderPubky(notification.body);
      return (
        senderPubky &&
        !mutedUsers?.includes(senderPubky) &&
        preferencesLoaded &&
        preferencesLoaded[notification.body.type as keyof typeof preferencesLoaded]
      );
    });

    // Group notifications by the same post to avoid duplicates
    return groupNotificationsByPost(filtered);
  };

  const groupNotificationsByPost = (notifications: NotificationView[]): NotificationView[] => {
    const groupedMap = new Map<string, NotificationView[]>();

    notifications.forEach((notification) => {
      const key = getNotificationGroupKey(notification);
      if (key) {
        if (!groupedMap.has(key)) {
          groupedMap.set(key, []);
        }
        groupedMap.get(key)!.push(notification);
      } else {
        // For notifications that can't be grouped, use timestamp as key
        const timestampKey = `timestamp_${notification.timestamp}`;
        if (!groupedMap.has(timestampKey)) {
          groupedMap.set(timestampKey, []);
        }
        groupedMap.get(timestampKey)!.push(notification);
      }
    });

    // Convert grouped notifications back to array, keeping only the most recent one from each group
    const result: NotificationView[] = [];
    groupedMap.forEach((group) => {
      if (group.length > 0) {
        // Sort by timestamp descending and take the most recent
        const sortedGroup = group.sort((a, b) => b.timestamp - a.timestamp);
        result.push(sortedGroup[0]);
      }
    });

    return result.sort((a, b) => b.timestamp - a.timestamp);
  };

  const getNotificationGroupKey = (notification: NotificationView): string | null => {
    const { body } = notification;

    // For post_edited notifications, group by edited_uri + edited_by + edit_source
    if (body.type === 'post_edited' && body.edited_uri && body.edited_by) {
      return `edited_${body.edited_uri}_${body.edited_by}_${body.edit_source || 'default'}`;
    }

    // For post_deleted notifications, group by deleted_uri + deleted_by + delete_source
    if (body.type === 'post_deleted' && body.deleted_uri && body.deleted_by) {
      return `deleted_${body.deleted_uri}_${body.deleted_by}_${body.delete_source || 'default'}`;
    }

    // For other notification types, don't group (return null to use timestamp as key)
    return null;
  };

  const fetchNotifications = useCallback(async () => {
    if (!pubky || !preferencesLoaded || !hasMore) return;

    try {
      if (initNotifications) {
        const filteredNotifications = filterNotifications(initNotifications);
        updateNotifications(filteredNotifications);

        // Use lastViewedTimestamp instead of timestamp for unread count
        if (lastViewedTimestamp > 0) {
          const unreadCount = filteredNotifications.reduce(
            (count, notification) => (notification.timestamp > lastViewedTimestamp ? count + 1 : count),
            0
          );

          if (unreadCount > 0) {
            setUnReadNotification(unreadCount);
          } else {
            setUnReadNotification(0);
          }
        } else if (timestamp > 0) {
          // Fallback to timestamp if lastViewedTimestamp is not set
          const unreadCount = filteredNotifications.reduce(
            (count, notification) => (notification.timestamp > timestamp ? count + 1 : count),
            0
          );

          if (unreadCount > 0) {
            setUnReadNotification(unreadCount);
          } else {
            setUnReadNotification(0);
          }
        } else {
          // If both timestamps are invalid, try to fetch timestamp
          const lastTimestamp = await getTimestampNotification();
          setTimestamp(lastTimestamp);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [
    pubky,
    preferencesLoaded,
    hasMore,
    initNotifications,
    lastViewedTimestamp,
    timestamp,
    setUnReadNotification,
    getTimestampNotification,
    setTimestamp
  ]);

  useEffect(() => {
    if (!pubky || !preferencesLoaded) return;

    // First check
    fetchNotifications();

    // Each 30 seconds
    const intervalId = setInterval(() => {
      setSkip(0);
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [pubky, preferencesLoaded, fetchNotifications]);

  useEffect(() => {
    // Don't process if we don't have notifications or if specs builder isn't ready yet
    if (!initNotifications || !pubky || !preferencesLoaded) return;

    const filtered = filterNotifications(initNotifications);
    updateNotifications(filtered);

    // Preload user profiles for the filtered notifications
    const userIds = extractUserIdsFromNotifications(filtered);
    if (userIds.length > 0) {
      preloadUserProfiles(userIds);
    }
  }, [
    initNotifications,
    timestamp,
    pubky,
    timestampLoaded,
    preferencesLoaded,
    setUnReadNotification,
    extractUserIdsFromNotifications,
    preloadUserProfiles
  ]);

  // Add effect to update lastViewedTimestamp when notifications are viewed
  useEffect(() => {
    if (notifications.length > 0) {
      const mostRecentTimestamp = Math.max(...notifications.map((n) => n.timestamp));
      setLastViewedTimestamp(mostRecentTimestamp);
    }
  }, [notifications]);

  // Add effect to recalculate unread count when notifications change
  useEffect(() => {
    if (!timestampLoaded || notifications.length === 0) return;

    // Calculate unread count based on current notifications
    const unreadCount = notifications.reduce(
      (count, notification) => (notification.timestamp > timestamp ? count + 1 : count),
      0
    );
    setUnReadNotification(unreadCount);
  }, [notifications, timestamp, timestampLoaded, setUnReadNotification]);

  const updateNotifications = (newNotifications: NotificationView[]) => {
    setNotifications((prev) => {
      const merged = [...prev, ...newNotifications].filter(
        (notification, index, self) => index === self.findIndex((n) => n.timestamp === notification.timestamp)
      );
      return merged.sort((a, b) => b.timestamp - a.timestamp);
    });
  };

  const extractSenderPubky = (notification: BodyNotification) => {
    return (
      notification.followed_by ||
      notification.tagged_by ||
      notification.replied_by ||
      notification.reposted_by ||
      notification.mentioned_by ||
      notification.deleted_by ||
      notification.edited_by
    );
  };

  const loadMoreNotifications = async () => {
    if (!pubky || !preferencesLoaded || !hasMore || loading) return;

    try {
      setLoading(true);

      // Fetch the next batch of notifications
      const nextNotifications = await getUserNotifications(pubky ?? '', undefined, undefined, skip, limit);

      if (nextNotifications && Array.isArray(nextNotifications) && nextNotifications.length > 0) {
        const filteredNotifications = filterNotifications(nextNotifications);

        if (filteredNotifications.length === 0) {
          // If all notifications are filtered out, try to get more
          setSkip((prev) => prev + limit);
          setLoading(false);
          return;
        }

        // Preload user profiles for the new notifications
        const userIds = extractUserIdsFromNotifications(filteredNotifications);
        if (userIds.length > 0) {
          preloadUserProfiles(userIds);
        }

        updateNotifications(filteredNotifications);
        setSkip((prev) => prev + limit);

        // If we got fewer notifications than the limit, we've reached the end
        if (nextNotifications.length < limit) {
          setHasMore(false);
        }
      } else {
        // No more notifications
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more notifications:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (pubky !== prevPubky) {
      setPrevPubky(pubky ?? '');
      setNotifications([]);
      setUnReadNotification(0);
      setSkip(0);
      setHasMore(true);
      setTimestampLoaded(false);
    }
  }, [pubky]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        profilesLoading,
        userProfilesCache,
        fetchNotifications,
        loadMoreNotifications,
        applySettings,
        preloadUserProfiles
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
