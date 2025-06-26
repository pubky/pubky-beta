'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { BodyNotification, NotificationView } from '@/types/User';
import { useUserNotifications } from '@/hooks/useUser';
import { NotificationPreferences } from '@/types';
import { defaultPreferences } from './_filters';

type NotificationsContextType = {
  notifications: NotificationView[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  loading: true,
  fetchNotifications: async () => {},
  loadMoreNotifications: async () => {}
});

export function NotificationsWrapper({ children }: { children: ReactNode }) {
  const { pubky, timestamp, loadSettings, mutedUsers, getTimestampNotification, setTimestamp } =
    usePubkyClientContext();
  const { setUnReadNotification } = useFilterContext();

  const limit = 30;
  const [skip, setSkip] = useState(0);
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevPubky, setPrevPubky] = useState<string | null>(null);
  const [lastViewedTimestamp, setLastViewedTimestamp] = useState<number>(0);
  const [timestampLoaded, setTimestampLoaded] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState<NotificationPreferences | null>(null);
  const { data: initNotifications, isLoading } = useUserNotifications(pubky ?? '', undefined, undefined, skip, limit);

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

    return filtered;
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

    // Calculate unread count only when timestamp is actually loaded
    if (timestampLoaded) {
      const unreadCount = filtered.reduce(
        (count, notification) => (notification.timestamp > timestamp ? count + 1 : count),
        0
      );
      setUnReadNotification(unreadCount);
    }
  }, [initNotifications, timestamp, pubky, timestampLoaded, preferencesLoaded, setUnReadNotification]);

  // Add effect to update lastViewedTimestamp when notifications are viewed
  useEffect(() => {
    if (notifications.length > 0) {
      const mostRecentTimestamp = Math.max(...notifications.map((n) => n.timestamp));
      setLastViewedTimestamp(mostRecentTimestamp);
    }
  }, [notifications]);

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
      if (initNotifications) {
        const filteredNotifications = filterNotifications(initNotifications);
        if (filteredNotifications.length === 0) {
          setHasMore(false);
          return;
        }
        updateNotifications(filteredNotifications);

        setSkip((prev) => prev + limit);
      }
    } catch (err) {
      console.error(err);
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
        fetchNotifications,
        loadMoreNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
