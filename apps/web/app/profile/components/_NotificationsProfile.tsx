'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { Skeleton } from '@/components';
import { useFilterContext, useNotificationsContext } from '@/contexts';
import { Typography } from '@social/ui-shared';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function NotificationsProfile() {
  const {
    notifications,
    loading: loadingNotifications,
    loadMoreNotifications,
  } = useNotificationsContext();
  const { unReadNotification } = useFilterContext();

  const loader = useInfiniteScroll(loadMoreNotifications, loadingNotifications);

  const displayedNotifications = notifications.slice(unReadNotification);

  return (
    <>
      {loadingNotifications && notifications.length === 0 ? (
        <Skeleton.Simple />
      ) : notifications?.length === 0 ? (
        <Typography.H2 className="mt-[100px] font-normal text-opacity-50 text-center">
          No notification yet
        </Typography.H2>
      ) : (
        <div>
          {unReadNotification > 0 && (
            <div className="mb-12">
              <Typography.Body className="font-semibold">
                New Notifications
              </Typography.Body>
              {notifications
                .slice(0, unReadNotification)
                .map((notification, index) => (
                  <Notifications.Notification
                    key={index}
                    notification={notification}
                  />
                ))}
            </div>
          )}
          {displayedNotifications.map((notification, index) => {
            const isLastElement = index === displayedNotifications.length - 1;

            return (
              <div key={index} ref={isLastElement ? loader : null}>
                <Notifications.Notification notification={notification} />
              </div>
            );
          })}
          {loadingNotifications && (
            <div className="flex justify-center mt-4 mb-8">
              <Skeleton.Simple />
            </div>
          )}
        </div>
      )}
    </>
  );
}
