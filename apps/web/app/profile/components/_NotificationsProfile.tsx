import { Notifications } from '@/app/notifications/components';
import { Skeleton } from '@/components';
import { INotification } from '@/types';
import { Button, Icon, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type NotificationsProps = {
  notifications: INotification[];
  loading: boolean;
};

export default function NotificationsProfile({
  notifications,
  loading,
}: NotificationsProps) {
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    if (!loading) setLoadingNotifications(false);
  }, [loading]);

  return (
    <>
      {loadingNotifications ? (
        <Skeleton.Simple />
      ) : notifications.length === 0 ? (
        <Typography.H2 className="mt-[100px] font-normal text-opacity-50 text-center">
          No notification yet
        </Typography.H2>
      ) : (
        <div>
          {notifications.slice(0, 10).map((notification, index) => {
            if (Array.isArray(notification)) {
              const firstNotificationType = notification[0]?.type;
              if (
                firstNotificationType === 'follow' ||
                firstNotificationType === 'new_friend' ||
                firstNotificationType === 'lost_friend'
              ) {
                return (
                  <Notifications.NotificationGroup
                    key={index}
                    notifications={notification}
                  />
                );
              } else if (firstNotificationType === 'tag_profile') {
                return (
                  <Notifications.NotificationTagGroup
                    key={index}
                    notifications={notification}
                  />
                );
              }
            } else {
              return (
                <Notifications.Notification
                  key={index}
                  notification={notification}
                />
              );
            }
            return null;
          })}
          <Link href={'/notifications'}>
            <Button.Medium
              icon={<Icon.Bell size="16" />}
              className="mt-4 mb-8 w-auto"
            >
              Show All Notifications
            </Button.Medium>
          </Link>
        </div>
      )}
    </>
  );
}
