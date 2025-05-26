'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { BodyNotification, NotificationView } from '@/types/User';
import { useUserNotifications } from '@/hooks/useUser';

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
  const { pubky, timestamp, notificationPreferences, mutedUsers, getTimestampNotification, setTimestamp } =
    usePubkyClientContext();
  const { setUnReadNotification } = useFilterContext();

  const limit = 30;
  const [skip, setSkip] = useState(0);
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevPubky, setPrevPubky] = useState<string | null>(null);
  const { data: initNotifications, isLoading } = useUserNotifications(pubky ?? '', undefined, undefined, skip, limit);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const fetchTimestamp = async () => {
      if (pubky && timestamp <= 0) {
        try {
          const lastTimestamp = await getTimestampNotification();
          setTimestamp(lastTimestamp);
        } catch (error) {
          console.warn('Error loading timestamp:', error);
        }
      }
    };

    fetchTimestamp();
  }, [pubky, timestamp, getTimestampNotification, setTimestamp]);

  useEffect(() => {
    if (!pubky || !notificationPreferences) return;

    // First check
    fetchNotifications();

    // Each 30 seconds
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [pubky, notificationPreferences]);

  useEffect(() => {
    // Don't process if we don't have notifications or if specs builder isn't ready yet
    if (!initNotifications || !pubky) return;

    const filtered = filterNotifications(initNotifications);
    updateNotifications(filtered);

    // Calculate unread count with proper timestamp comparison
    if (timestamp > 0) {
      const unreadCount = filtered.reduce(
        (count, notification) => (notification.timestamp > timestamp ? count + 1 : count),
        0
      );
      if (unreadCount > 0) {
        setUnReadNotification(unreadCount);
      }
    }
  }, [initNotifications, timestamp, pubky, setUnReadNotification]);

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
  const filterNotifications = (notifications: NotificationView[]) => {
    // First filter out muted users and disabled notification types
    const filtered = notifications.filter((notification) => {
      const senderPubky = extractSenderPubky(notification.body);
      return (
        senderPubky &&
        !mutedUsers?.includes(senderPubky) &&
        notificationPreferences[notification.body.type as keyof typeof notificationPreferences]
      );
    });

    // Group notifications by edited_uri and edit_source for post_edited type
    const groupedNotifications = filtered.reduce(
      (acc, notification) => {
        if (notification.body.type === 'post_edited' && notification.body.edited_uri) {
          // For tagged posts, group them together
          if (notification.body.edit_source === 'tagged_post') {
            const key = `${notification.body.edited_uri}_${notification.body.edited_by}_tagged_post`;
            if (!acc[key]) {
              acc[key] = {
                notification,
                sources: new Set([notification.body.edit_source])
              };
            } else {
              acc[key].sources.add(notification.body.edit_source);
            }
          } else {
            // For other types (reply, repost, etc.), keep them separate
            const key = `${notification.timestamp}_${notification.body.type}_${notification.body.edit_source}`;
            acc[key] = {
              notification,
              sources: new Set([notification.body.edit_source])
            };
          }
        } else {
          // For non-post_edited notifications, keep them as is
          acc[`${notification.timestamp}_${notification.body.type}`] = {
            notification,
            sources: new Set()
          };
        }
        return acc;
      },
      {} as Record<string, { notification: NotificationView; sources: Set<string> }>
    );

    // Convert grouped notifications back to array
    return Object.values(groupedNotifications).map(({ notification, sources }) => {
      if (sources.size > 0) {
        // For post_edited notifications, add the sources to the notification body
        return {
          ...notification,
          body: {
            ...notification.body,
            edit_sources: Array.from(sources)
          }
        };
      }
      return notification;
    });
  };

  const fetchNotifications = async () => {
    if (!pubky || !notificationPreferences || !hasMore) return;

    try {
      if (initNotifications) {
        const filteredNotifications = filterNotifications(initNotifications);

        updateNotifications(filteredNotifications);

        // Ensure timestamp is valid before calculating unread count
        if (timestamp > 0) {
          const unreadCount = filteredNotifications.reduce(
            (count, notification) => (notification.timestamp > timestamp ? count + 1 : count),
            0
          );

          if (unreadCount > 0) {
            setUnReadNotification(unreadCount);
          }
        } else {
          // If timestamp is invalid, try to fetch it
          const lastTimestamp = await getTimestampNotification();
          setTimestamp(lastTimestamp);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMoreNotifications = async () => {
    if (!pubky || !notificationPreferences || !hasMore || loading) return;

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

      // Fetch notifications only when pubky changes
      if (notificationPreferences && pubky) {
        fetchNotifications();
      }
    }
  }, [pubky, notificationPreferences]);

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
