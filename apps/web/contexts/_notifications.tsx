'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { INotification } from '@/types';
import { useFilterContext, usePubkyClientContext } from '@/contexts';

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
  let currentTagProfileNotifications: INotification[] = [];
  let currentTagPostNotifications: INotification[] = [];
  let currentTaggedBy: string | null = null;
  let currentPostUri: string | null = null;

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
      if (currentTagProfileNotifications.length > 0) {
        mergedNotifications.push(currentTagProfileNotifications);
        currentTagProfileNotifications = [];
        currentTaggedBy = null;
      }
      if (currentTagPostNotifications.length > 0) {
        mergedNotifications.push(currentTagPostNotifications);
        currentTagPostNotifications = [];
        currentTaggedBy = null;
        currentPostUri = null;
      }
    };

    if (notification.type === 'follow') {
      const alreadyFollowing = currentFollowNotifications.some(
        (n) => n.body.followedBy === notification.body.followedBy
      );

      if (
        !alreadyFollowing &&
        currentFollowNotifications.length > 0 &&
        notification.timestamp -
          currentFollowNotifications[currentFollowNotifications.length - 1]
            .timestamp <=
          3600000
      ) {
        currentFollowNotifications.push(notification);
      } else if (!alreadyFollowing) {
        addCurrentNotifications();
        currentFollowNotifications = [notification];
      }
    } else if (notification.type === 'new_friend') {
      const alreadyNewFriend = currentNewFriendNotifications.some(
        (n) => n.body.followedBy === notification.body.followedBy
      );

      if (
        !alreadyNewFriend &&
        currentNewFriendNotifications.length > 0 &&
        notification.timestamp -
          currentNewFriendNotifications[
            currentNewFriendNotifications.length - 1
          ].timestamp <=
          3600000
      ) {
        currentNewFriendNotifications.push(notification);
      } else if (!alreadyNewFriend) {
        addCurrentNotifications();
        currentNewFriendNotifications = [notification];
      }
    } else if (notification.type === 'lost_friend') {
      const alreadyLostFriend = currentLostFriendNotifications.some(
        (n) => n.body.unfollowedBy === notification.body.unfollowedBy
      );

      if (
        !alreadyLostFriend &&
        currentLostFriendNotifications.length > 0 &&
        notification.timestamp -
          currentLostFriendNotifications[
            currentLostFriendNotifications.length - 1
          ].timestamp <=
          3600000
      ) {
        currentLostFriendNotifications.push(notification);
      } else if (!alreadyLostFriend) {
        addCurrentNotifications();
        currentLostFriendNotifications = [notification];
      }
    } else if (notification.type === 'tag_profile') {
      if (
        currentTaggedBy === notification.body.taggedBy &&
        currentTagProfileNotifications.length > 0 &&
        notification.timestamp -
          currentTagProfileNotifications[
            currentTagProfileNotifications.length - 1
          ].timestamp <=
          3600000
      ) {
        currentTagProfileNotifications.push(notification);
      } else {
        addCurrentNotifications();
        currentTagProfileNotifications = [notification];
        currentTaggedBy = notification.body.taggedBy || null;
      }
    } else if (notification.type === 'tag_post') {
      if (
        currentTaggedBy === notification.body.taggedBy &&
        currentPostUri === notification.body.postUri &&
        currentTagPostNotifications.length > 0 &&
        notification.timestamp -
          currentTagPostNotifications[currentTagPostNotifications.length - 1]
            .timestamp <=
          3600000
      ) {
        currentTagPostNotifications.push(notification);
      } else {
        addCurrentNotifications();
        currentTagPostNotifications = [notification];
        currentTaggedBy = notification.body.taggedBy || null;
        currentPostUri = notification.body.postUri || null;
      }
    } else {
      addCurrentNotifications();
      mergedNotifications.push(notification);
    }
  });

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
    if (currentTagProfileNotifications.length > 0) {
      mergedNotifications.push(currentTagProfileNotifications);
      currentTagProfileNotifications = [];
      currentTaggedBy = null;
    }
    if (currentTagPostNotifications.length > 0) {
      mergedNotifications.push(currentTagPostNotifications);
      currentTagPostNotifications = [];
      currentTaggedBy = null;
      currentPostUri = null;
    }
  };

  addCurrentNotifications();

  return mergedNotifications;
};

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  loading: true,
  fetchNotifications: async () => {},
});

export function NotificationsWrapper({ children }: { children: ReactNode }) {
  const { pubky } = usePubkyClientContext();
  //const { getNotifications } = useClientContext();
  const { notificationPreferences } = useFilterContext();
  const [notifications, setNotifications] = useState<
    (INotification | INotification[])[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      if (!pubky) return;

      const results = null; //await getNotifications();
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
