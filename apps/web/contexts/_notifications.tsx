'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
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
  loadMoreNotifications: async () => {},
});

export function NotificationsWrapper({ children }: { children: ReactNode }) {
  const { pubky, timestamp, notificationPreferences, mutedUsers } =
    usePubkyClientContext();
  const { setUnReadNotification } = useFilterContext();

  const limit = 30;
  const [skip, setSkip] = useState(0);
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevPubky, setPrevPubky] = useState<string | null>(null);

  const { data: initNotifications } = useUserNotifications(
    pubky ?? '',
    undefined,
    undefined,
    skip,
    limit,
  );

  useEffect(() => {
    if (!initNotifications) return;

    setLoading(true);

    const filtered = filterNotifications(initNotifications);
    updateNotifications(filtered);

    // Calculate unread
    const unreadCount = filtered.reduce(
      (count, notification) =>
        timestamp && notification.timestamp > timestamp ? count + 1 : count,
      0,
    );
    setUnReadNotification(unreadCount);

    // Check if there’s more
    if (filtered.length < limit) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setLoading(false);
  }, [initNotifications]);

  const updateNotifications = (newNotifications: NotificationView[]) => {
    setNotifications((prev) => {
      const merged = [...prev, ...newNotifications].filter(
        (notification, index, self) =>
          index ===
          self.findIndex((n) => n.timestamp === notification.timestamp),
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

  const filterNotifications = (notifications: NotificationView[]) =>
    notifications.filter((notification) => {
      const senderPubky = extractSenderPubky(notification.body);
      return (
        senderPubky &&
        !mutedUsers?.includes(senderPubky) &&
        notificationPreferences[
          notification.body.type as keyof typeof notificationPreferences
        ]
      );
    });

  // TODO: guys there were 2 loops here, the second one not using the new data
  // from reactQuery. I bypassed it all on the useEffect above with dependencies
  // on [initNotifications]. I don't think much of this logic is needed.

  const fetchNotifications = async () => {
    if (!pubky || !notificationPreferences || !hasMore) return;

    try {
      setLoading(true);

      if (initNotifications) {
        const filteredNotifications = filterNotifications(initNotifications);

        updateNotifications(filteredNotifications);

        const unreadCount = filteredNotifications.reduce(
          (count, notification) =>
            timestamp && notification.timestamp > timestamp ? count + 1 : count,
          0,
        );

        setUnReadNotification(unreadCount);

        if (filteredNotifications.length < limit) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNotifications = async () => {
    if (!pubky || !notificationPreferences || !hasMore || loading) return;

    try {
      setLoading(true);

      if (initNotifications) {
        const filteredNotifications = filterNotifications(initNotifications);

        updateNotifications(filteredNotifications);

        if (filteredNotifications.length < limit) {
          setHasMore(false);
        } else {
          setSkip((prev) => prev + limit);
        }
      }
    } catch (err) {
      console.error(err);
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
    }

    if (notificationPreferences && pubky) {
      fetchNotifications();
    }
  }, [pubky, notificationPreferences]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        loadMoreNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
