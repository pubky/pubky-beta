'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { INotification } from '@/types';
import { useClientContext, useFilterContext } from '@/contexts';

type NotificationsContextType = {
  notifications: (INotification | INotification[])[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
};

const mergeConsecutiveFollowNotifications = (
  notifications: INotification[]
): (INotification | INotification[])[] => {
  const mergedNotifications: (INotification | INotification[])[] = [];
  let currentFollowNotifications: INotification[] = [];

  notifications.forEach((notification) => {
    if (notification.type === 'follow') {
      if (currentFollowNotifications.length > 0) {
        if (
          notification.timestamp -
            currentFollowNotifications[currentFollowNotifications.length - 1]
              .timestamp <=
          10000
        ) {
          currentFollowNotifications.push(notification);
        } else {
          mergedNotifications.push(currentFollowNotifications);
          currentFollowNotifications = [notification];
        }
      } else {
        currentFollowNotifications = [notification];
      }
    } else {
      if (currentFollowNotifications.length > 0) {
        mergedNotifications.push(currentFollowNotifications);
        currentFollowNotifications = [];
      }
      mergedNotifications.push(notification);
    }
  });

  if (currentFollowNotifications.length > 0) {
    mergedNotifications.push(currentFollowNotifications);
  }

  return mergedNotifications;
};

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  loading: true,
  fetchNotifications: async () => {},
});

export function NotificationsWrapper({ children }: { children: ReactNode }) {
  const { pubky, getNotifications } = useClientContext();
  const { notificationPreferences } = useFilterContext();
  const [notifications, setNotifications] = useState<
    (INotification | INotification[])[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const results = await getNotifications();
      if (results) {
        const filteredNotifications = results.feed.filter(
          (notification: INotification) =>
            notificationPreferences[
              notification.type as keyof typeof notificationPreferences
            ]
        );
        const mergedNotifications = mergeConsecutiveFollowNotifications(
          filteredNotifications
        );
        setNotifications(mergedNotifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Modificato l'intervallo per una frequenza più pratica
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

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
