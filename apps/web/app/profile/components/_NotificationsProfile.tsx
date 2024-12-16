'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { Skeleton } from '@/components';
import {
  useFilterContext,
  useNotificationsContext,
  usePubkyClientContext,
} from '@/contexts';
import { Typography } from '@social/ui-shared';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useEffect } from 'react';

export default function NotificationsProfile() {
  const {
    notifications,
    loading: loadingNotifications,
    loadMoreNotifications,
  } = useNotificationsContext();
  const { unReadNotification } = useFilterContext();
  const { putTimestampNotification } = usePubkyClientContext();
  const timestamp = Date.now();

  const loader = useInfiniteScroll(loadMoreNotifications, loadingNotifications);

  const displayedNotifications = notifications.slice(unReadNotification);

  useEffect(() => {
    const putTimestamp = async () => {
      await putTimestampNotification(timestamp);
    };
    putTimestamp();
  }, []);

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
            <div className="bg-[#C8FF00] bg-opacity-10 rounded-lg px-2">
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
              <div
                className="px-2"
                key={index}
                ref={isLastElement ? loader : null}
              >
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
