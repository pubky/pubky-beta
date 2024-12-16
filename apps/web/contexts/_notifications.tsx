'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { NotificationView } from '@/types/User';
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
  const { pubky, timestamp, notificationPreferences } = usePubkyClientContext();
  const { setUnReadNotification } = useFilterContext();

  const limit = 30;
  const [skip, setSkip] = useState(0);
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: initNotifications } = useUserNotifications(
    pubky ?? '',
    undefined,
    undefined,
    skip,
    limit,
  );

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

  const fetchNotifications = async () => {
    try {
      if (!pubky || !notificationPreferences) return;

      setLoading(true);

      if (initNotifications) {
        const filteredNotifications = initNotifications.filter(
          (notification: NotificationView) => {
            return (
              notificationPreferences &&
              notificationPreferences[
                notification.body.type as keyof typeof notificationPreferences
              ]
            );
          },
        );

        updateNotifications(filteredNotifications);

        const unreadCount = filteredNotifications.reduce(
          (count: number, notification: NotificationView) => {
            if (timestamp && notification.timestamp > timestamp) {
              return count + 1;
            }
            return count;
          },
          0,
        );
        setUnReadNotification(unreadCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNotifications = async () => {
    try {
      if (!pubky || !notificationPreferences) return;

      setLoading(true);

      if (initNotifications) {
        const filteredNotifications = initNotifications.filter(
          (notification: NotificationView) => {
            return (
              notificationPreferences &&
              notificationPreferences[
                notification.body.type as keyof typeof notificationPreferences
              ]
            );
          },
        );

        updateNotifications(filteredNotifications);

        setSkip((prev) => prev + limit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notificationPreferences) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 3000);
      return () => clearInterval(interval);
    }
  }, [pubky, notificationPreferences, initNotifications]);

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
