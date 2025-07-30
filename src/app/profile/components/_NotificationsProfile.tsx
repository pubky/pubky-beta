'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { ContentNotFound, Skeleton } from '@/components';
import { useFilterContext, useNotificationsContext, usePubkyClientContext } from '@/contexts';
import { Icon } from '@social/ui-shared';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function NotificationsProfile() {
  const {
    notifications,
    loading: loadingNotifications,
    profilesLoading,
    loadMoreNotifications
  } = useNotificationsContext();
  const { unReadNotification, setUnReadNotification } = useFilterContext();
  const [tempUnReadNotification, setTempUnReadNotification] = useState(0);
  const [uiUnreadCount, setUiUnreadCount] = useState(0); // Separate state for UI display
  const [isInitialized, setIsInitialized] = useState(false);
  const { putTimestampNotification } = usePubkyClientContext();
  const pathname = usePathname();
  const [isOnProfilePage, setIsOnProfilePage] = useState(true);

  const loader = useInfiniteScroll(loadMoreNotifications, loadingNotifications);

  const displayedNotifications = notifications.slice(tempUnReadNotification);

  // Track if user is on profile page
  useEffect(() => {
    const isProfilePage = pathname === '/profile' || pathname.startsWith('/profile/');
    setIsOnProfilePage(isProfilePage);

    // If user navigates away from profile page, hide unread dots
    if (!isProfilePage && uiUnreadCount > 0) {
      setUiUnreadCount(0);
      setTempUnReadNotification(0);
    }
  }, [pathname, uiUnreadCount]);

  // Wait for notifications to be loaded before processing unread notifications
  useEffect(() => {
    if (!loadingNotifications && notifications.length >= 0 && !isInitialized) {
      // Add a small delay to ensure the context is fully initialized
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loadingNotifications, notifications.length, isInitialized]);

  useEffect(() => {
    // Only process unread notifications after the component is initialized and notifications are loaded
    if (isInitialized && unReadNotification > 0 && notifications.length > 0 && isOnProfilePage) {
      setTempUnReadNotification(unReadNotification);
      setUiUnreadCount(unReadNotification); // Set UI count immediately
      setUnReadNotification(0);

      const updateTimestamp = async () => {
        await putTimestampNotification();
      };
      updateTimestamp();
    } else if (isInitialized && unReadNotification === 0 && tempUnReadNotification > 0 && !isOnProfilePage) {
      // Reset tempUnReadNotification when there are no unread notifications and user is not on profile page
      setTempUnReadNotification(0);
    }
  }, [
    unReadNotification,
    setUnReadNotification,
    putTimestampNotification,
    isInitialized,
    notifications.length,
    tempUnReadNotification,
    isOnProfilePage
  ]);

  // Show loading skeleton only for initial load when no notifications are available
  if (!isInitialized && loadingNotifications && notifications.length === 0) {
    return <Skeleton.Simple />;
  }

  return (
    <>
      {loadingNotifications && notifications.length === 0 ? (
        <Skeleton.Simple />
      ) : notifications?.length === 0 ? (
        <ContentNotFound
          icon={<Icon.SmileySad size="48" color="#C8FF00" />}
          title="Nothing to see here yet"
          description="Tags, follows, reposts, and account information will be displayed here."
        >
          <div className="absolute top-32 z-0">
            <Image alt="not-found-notification" width={477} height={271} src="/images/webp/not-found/search.webp" />
          </div>
        </ContentNotFound>
      ) : (
        <div className="px-6 py-[18px] bg-white/10 rounded-lg" id="notifications-list">
          {uiUnreadCount > 0 && (
            <div>
              {notifications.slice(0, uiUnreadCount).map((notification) => (
                <Notifications.Notification key={notification.timestamp} notification={notification} unread />
              ))}
            </div>
          )}
          {displayedNotifications.map((notification, index) => {
            const isLastElement = index === displayedNotifications.length - 1;

            return (
              <div key={notification.timestamp} ref={isLastElement ? loader : null}>
                <Notifications.Notification notification={notification} />
              </div>
            );
          })}
        </div>
      )}
      {loadingNotifications && notifications.length > 0 && (
        <div className="flex justify-center mt-4 mb-8">
          <Skeleton.Simple />
        </div>
      )}
    </>
  );
}
