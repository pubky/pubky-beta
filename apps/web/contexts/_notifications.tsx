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
};

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  loading: true,
  fetchNotifications: async () => {},
});

export function NotificationsWrapper({ children }: { children: ReactNode }) {
  const { pubky, timestamp, notificationPreferences } = usePubkyClientContext();
  const { data: initNotifications } = useUserNotifications(
    pubky ?? '',
    undefined,
    timestamp === 0 ? undefined : timestamp,
    undefined,
    10,
  );
  const { setUnReadNotification } = useFilterContext();
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      if (!pubky || !notificationPreferences) return;

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

        setNotifications((prev) => [
          ...filteredNotifications,
          ...prev.filter((notification) => {
            return !filteredNotifications.some(
              (filteredNotification) =>
                filteredNotification.timestamp === notification.timestamp,
            );
          }),
        ]);

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

  useEffect(() => {
    if (notificationPreferences) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 3000);
      return () => clearInterval(interval);
    }
  }, [pubky, notificationPreferences, initNotifications]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, loading, fetchNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
