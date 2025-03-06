'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { ContentNotFound, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { Icon } from '@social/ui-shared';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectNotifications,
  selectNotificationsLoading,
  selectUnreadCount,
  fetchNotifications,
  loadMoreNotifications,
  setTimestamp,
  setUnreadCount
} from '@/store/slices/notifications';

export default function NotificationsProfile() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const loadingNotifications = useAppSelector(selectNotificationsLoading);
  const unreadCount = useAppSelector(selectUnreadCount);
  const [tempUnReadNotification, setTempUnReadNotification] = useState(0);
  const { putTimestampNotification, pubky, mutedUsers, notificationPreferences, timestamp } = usePubkyClientContext();
  const hasInitialized = useRef(false);
  const hasFetchedInitial = useRef(false);

  const fetchNotificationsData = useCallback(() => {
    if (!pubky || !notificationPreferences || !timestamp) return;

    dispatch(
      fetchNotifications({
        pubky,
        mutedUsers,
        notificationPreferences,
        timestamp
      })
    );
  }, [pubky, notificationPreferences, mutedUsers, timestamp, dispatch]);

  const handleLoadMore = async () => {
    if (!pubky || !notificationPreferences) return;

    dispatch(
      loadMoreNotifications({
        pubky,
        mutedUsers,
        notificationPreferences
      })
    );
  };

  const loader = useInfiniteScroll(handleLoadMore, loadingNotifications);

  // Single effect to control the entire initialization and fetch flow
  useEffect(() => {
    const initialize = async () => {
      // If we don't have the required dependencies, do nothing
      if (!pubky || !notificationPreferences) return;

      // If we haven't initialized yet, perform initialization
      if (!hasInitialized.current) {
        try {
          await putTimestampNotification();
          hasInitialized.current = true;
        } catch (error) {
          console.error('Error initializing notifications:', error);
          return;
        }
      }

      // If we have a valid timestamp and haven't done the initial fetch
      if (timestamp && !hasFetchedInitial.current) {
        dispatch(setTimestamp(timestamp));
        hasFetchedInitial.current = true;
        fetchNotificationsData();
        return;
      }
    };

    initialize();
  }, [pubky, notificationPreferences, timestamp, dispatch, fetchNotificationsData]);

  // Effect to handle unread notifications
  useEffect(() => {
    if (unreadCount) {
      setTempUnReadNotification(unreadCount);
      setTimeout(() => setTempUnReadNotification(0), 3000);
      dispatch(setUnreadCount(0));
    }
  }, [unreadCount, dispatch]);

  return (
    <>
      {loadingNotifications && notifications.length === 0 ? (
        <Skeleton.Simple />
      ) : (
        <div className="flex flex-col gap-1">
          <div className="px-6 py-[18px] bg-white/10 rounded-lg">
            {tempUnReadNotification > 0 && (
              <div>
                {notifications.slice(0, tempUnReadNotification).map((notification, index) => (
                  <Notifications.Notification key={index} notification={notification} unread />
                ))}
              </div>
            )}
            {notifications.length > 0 ? (
              notifications.map((notification, index) => {
                const isLastElement = index === notifications.length - 1;
                return (
                  <div key={index} ref={isLastElement ? loader : null}>
                    <Notifications.Notification notification={notification} />
                  </div>
                );
              })
            ) : (
              <ContentNotFound
                icon={<Icon.SmileySad size="48" color="#C8FF00" />}
                title="No notifications to show"
                description="Try selecting a different filter"
              />
            )}
          </div>
        </div>
      )}
      {loadingNotifications && (
        <div className="flex justify-center mt-4 mb-8">
          <Skeleton.Simple />
        </div>
      )}
    </>
  );
}
