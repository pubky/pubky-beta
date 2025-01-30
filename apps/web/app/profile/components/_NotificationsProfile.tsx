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
import { useEffect, useState } from 'react';

export default function NotificationsProfile() {
  const {
    notifications,
    loading: loadingNotifications,
    loadMoreNotifications,
  } = useNotificationsContext();
  const { unReadNotification, setUnReadNotification } = useFilterContext();
  const [tempUnReadNotication, setTempUnReadNotification] = useState(0);
  const { putTimestampNotification } = usePubkyClientContext();

  const loader = useInfiniteScroll(loadMoreNotifications, loadingNotifications);

  const displayedNotifications = notifications.slice(tempUnReadNotication);

  useEffect(() => {
    if (unReadNotification) {
      setTempUnReadNotification(unReadNotification);
      setTimeout(() => setTempUnReadNotification(0), 3000);
    }
    setUnReadNotification(0);
    const putTimestamp = async () => {
      await putTimestampNotification();
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
          {tempUnReadNotication > 0 && (
            <div className="px-2">
              {notifications
                .slice(0, tempUnReadNotication)
                .map((notification, index) => (
                  <Notifications.Notification
                    key={index}
                    notification={notification}
                    unread
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
