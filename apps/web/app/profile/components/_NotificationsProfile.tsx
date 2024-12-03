'use client';

import { Notifications } from '@/app/profile/components/notifications/components';
import { Skeleton } from '@/components';
import { useFilterContext } from '@/contexts';
import { NotificationView } from '@/types/User';
import { Button, Icon, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';

type NotificationsProps = {
  notifications: NotificationView[];
  loading: boolean;
};

export default function NotificationsProfile({
  notifications,
  loading,
}: NotificationsProps) {
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { unReadNotification } = useFilterContext();

  useEffect(() => {
    if (!loading) setLoadingNotifications(false);
  }, [loading]);

  const displayedNotifications = showAll
    ? notifications.slice(unReadNotification)
    : notifications?.slice(unReadNotification, unReadNotification + 10);

  return (
    <>
      {loadingNotifications ? (
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
            return (
              <Notifications.Notification
                key={index}
                notification={notification}
              />
            );
          })}
          {notifications?.length > 10 && !showAll && (
            <Button.Medium
              icon={<Icon.Bell size="16" />}
              className="mt-4 mb-8 w-auto"
              onClick={() => setShowAll(true)}
            >
              Show All Notifications
            </Button.Medium>
          )}
        </div>
      )}
    </>
  );
}
