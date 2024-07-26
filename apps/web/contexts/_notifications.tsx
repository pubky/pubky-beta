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

const mergeConsecutiveNotifications = (
  notifications: INotification[]
): (INotification | INotification[])[] => {
  const mergedNotifications: (INotification | INotification[])[] = [];
  let currentFollowNotifications: INotification[] = [];
  let currentNewFriendNotifications: INotification[] = [];
  let currentLostFriendNotifications: INotification[] = [];

  notifications.forEach((notification) => {
    const addCurrentNotifications = () => {
      if (currentFollowNotifications.length > 0) {
        mergedNotifications.push(currentFollowNotifications);
        currentFollowNotifications = [];
      }
      if (currentNewFriendNotifications.length > 0) {
        mergedNotifications.push(currentNewFriendNotifications);
        currentNewFriendNotifications = [];
      }
      if (currentLostFriendNotifications.length > 0) {
        mergedNotifications.push(currentLostFriendNotifications);
        currentLostFriendNotifications = [];
      }
    };

    if (notification.type === 'follow') {
      if (
        currentFollowNotifications.length > 0 &&
        notification.timestamp -
          currentFollowNotifications[currentFollowNotifications.length - 1]
            .timestamp <=
          10000
      ) {
        currentFollowNotifications.push(notification);
      } else {
        addCurrentNotifications();
        currentFollowNotifications = [notification];
      }
    } else if (notification.type === 'new_friend') {
      if (
        currentNewFriendNotifications.length > 0 &&
        notification.timestamp -
          currentNewFriendNotifications[
            currentNewFriendNotifications.length - 1
          ].timestamp <=
          10000
      ) {
        currentNewFriendNotifications.push(notification);
      } else {
        addCurrentNotifications();
        currentNewFriendNotifications = [notification];
      }
    } else if (notification.type === 'lost_friend') {
      if (
        currentLostFriendNotifications.length > 0 &&
        notification.timestamp -
          currentLostFriendNotifications[
            currentLostFriendNotifications.length - 1
          ].timestamp <=
          10000
      ) {
        currentLostFriendNotifications.push(notification);
      } else {
        addCurrentNotifications();
        currentLostFriendNotifications = [notification];
      }
    } else {
      addCurrentNotifications();
      mergedNotifications.push(notification);
    }
  });

  if (currentFollowNotifications.length > 0) {
    mergedNotifications.push(currentFollowNotifications);
  }
  if (currentNewFriendNotifications.length > 0) {
    mergedNotifications.push(currentNewFriendNotifications);
  }
  if (currentLostFriendNotifications.length > 0) {
    mergedNotifications.push(currentLostFriendNotifications);
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
        const mergedNotifications = mergeConsecutiveNotifications(
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
    const interval = setInterval(fetchNotifications, 10000);
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
