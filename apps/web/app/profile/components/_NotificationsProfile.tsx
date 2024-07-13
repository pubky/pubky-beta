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
          {notifications.slice(0, 10).map((notification, index) => (
            <Notifications.Notification
              key={index}
              notification={notification}
            />
          ))}
          <Link href={'/notifications'}>
            <Button.Medium
              icon={<Icon.Bell size="16" />}
              className="mt-4 mb-8 md:w-[30%]"
            >
              Show Notifications
            </Button.Medium>
          </Link>
        </div>
      )}
    </>
  );
}
