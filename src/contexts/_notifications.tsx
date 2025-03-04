'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { BodyNotification, NotificationView } from '@/types/User';
import { useUserNotifications } from '@/hooks/useUser';
import { FilterNotificationPreferences } from '@/types';

type NotificationsContextType = {
  notifications: NotificationView[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  selectedFilter: FilterNotificationPreferences;
  setSelectedFilter: any;
};

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  loading: true,
  fetchNotifications: async () => {},
  loadMoreNotifications: async () => {},
  selectedFilter: 'all',
  setSelectedFilter: () => {}
});

export const filterMap: Record<FilterNotificationPreferences, string[]> = {
  all: [],
  follow: ['follow'],
  new_friend: ['new_friend'],
  tagged: ['tag_profile', 'tag_post'],
  mention: ['mention'],
  reply: ['reply'],
  repost: ['repost'],
  post_deleted: ['post_deleted'],
  post_edited: ['post_edited']
};

export function NotificationsWrapper({ children }: { children: ReactNode }) {
  const { pubky, timestamp, notificationPreferences, mutedUsers } = usePubkyClientContext();
  const { setUnReadNotification } = useFilterContext();

  const limit = 30;
  const [skip, setSkip] = useState(0);
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterNotificationPreferences>('all');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevPubky, setPrevPubky] = useState<string | null>(null);

  const { data: initNotifications, isLoading } = useUserNotifications(pubky ?? '', undefined, undefined, skip, limit);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // Don't process if we don't have notifications or timestamp is invalid (0)
    // or if specs builder isn't ready yet
    if (!initNotifications || timestamp <= 0) return;

    const filtered = filterNotifications(initNotifications);
    updateNotifications(filtered);

    // Calculate unread count only after we have a valid timestamp
    const unreadCount = filtered.reduce(
      (count, notification) => (timestamp && notification.timestamp > timestamp ? count + 1 : count),
      0
    );
    setUnReadNotification(unreadCount);
  }, [initNotifications, timestamp]);

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

  const filterNotifications = (notifications: NotificationView[]) =>
    notifications.filter((notification) => {
      const senderPubky = extractSenderPubky(notification.body);
      return (
        senderPubky &&
        !mutedUsers?.includes(senderPubky) &&
        notificationPreferences[notification.body.type as keyof typeof notificationPreferences] &&
        (selectedFilter === 'all' || filterMap[selectedFilter]?.includes(notification.body.type))
      );
    });

  const fetchNotifications = async () => {
    if (!pubky || !notificationPreferences) return;

    setLoading(true);
    try {
      if (initNotifications) {
        const filteredNotifications = filterNotifications(initNotifications);
        setNotifications(filteredNotifications);
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
      setSkip((prev) => prev + limit);

      if (initNotifications) {
        const filteredNotifications = filterNotifications(initNotifications);
        if (filteredNotifications.length === 0) {
          setHasMore(false);
          return;
        }
        updateNotifications(filteredNotifications);
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
    }

    if (notificationPreferences && pubky) {
      fetchNotifications();
    }
  }, [pubky, notificationPreferences, timestamp]);

  useEffect(() => {
    setSkip(0);
    setNotifications([]);
    setHasMore(true);
    
    if (selectedFilter === 'all') {
      fetchNotifications();
    } else {
      const filtered = filterNotifications(initNotifications);
      setNotifications(filtered);
    }
  }, [selectedFilter]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        loadMoreNotifications,
        selectedFilter,
        setSelectedFilter
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}
