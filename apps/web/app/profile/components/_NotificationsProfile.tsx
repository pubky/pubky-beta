import { Notifications } from '@/app/notifications/components';
import { Skeleton } from '@/components';
import { INotification } from '@/types';
import { Button, Icon, Typography } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type NotificationGroup = INotification[];

function groupNotifications(
  notifications: INotification[]
): NotificationGroup[] {
  const groupedNotifications: NotificationGroup[] = [];
  let currentGroup: NotificationGroup = [];

  notifications.forEach((notification) => {
    if (
      currentGroup.length === 0 ||
      currentGroup[0].type === notification.type
    ) {
      currentGroup.push(notification);
    } else {
      groupedNotifications.push(currentGroup);
      currentGroup = [notification];
    }
  });

  if (currentGroup.length > 0) {
    groupedNotifications.push(currentGroup);
  }

  return groupedNotifications;
}

type NotificationsProps = {
  notifications: INotification[];
  loading: boolean;
};

export default function NotificationsProfile({
  notifications,
  loading,
}: NotificationsProps) {
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [groupedNotifications, setGroupedNotifications] = useState<
    NotificationGroup[]
  >([]);

  useEffect(() => {
    if (!loading) {
      setLoadingNotifications(false);
      setGroupedNotifications(groupNotifications(notifications));
    }
  }, [loading, notifications]);

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
          {groupedNotifications.slice(0, 10).map((group, index) => (
            <Notifications.NotificationGroup key={index} group={group} />
          ))}
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
