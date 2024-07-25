'use client';

import { Content, Typography } from '@social/ui-shared';
import { useNotificationsContext } from '@/contexts';
import {
  CreatePost,
  Header,
  HotTags,
  Sidebar,
  Skeleton,
  WhoFollow,
} from '@/components';
import { Notifications } from './components';
import { useState, useEffect } from 'react';
import { INotification } from '@/types';

type NotificationGroup = INotification[];

function groupNotifications(
  notifications: INotification[]
): NotificationGroup[] {
  const groupedNotifications: NotificationGroup[] = [];
  let currentGroup: NotificationGroup = [];
  let previousNotification: INotification | null = null;

  notifications.forEach((notification) => {
    if (
      currentGroup.length === 0 ||
      (previousNotification &&
        previousNotification.type === notification.type &&
        previousNotification.body.taggedBy === notification.body.taggedBy &&
        previousNotification.body.postUri === notification.body.postUri)
    ) {
      currentGroup.push(notification);
    } else {
      if (currentGroup.length > 0) {
        groupedNotifications.push(currentGroup);
      }
      currentGroup = [notification];
    }

    previousNotification = notification;
  });

  if (currentGroup.length > 0) {
    groupedNotifications.push(currentGroup);
  }

  return groupedNotifications;
}
export default function Index() {
  const { notifications, loading } = useNotificationsContext();
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
    <Content.Main>
      <Header className="hidden md:block" title="Notifications" />
      <Content.Grid className="flex w-full justify-between items-start gap-12">
        <Notifications.Root>
          {loadingNotifications ? (
            <Skeleton.Simple />
          ) : groupedNotifications.length === 0 ? (
            <Typography.Body variant="small" className="text-opacity-50">
              No notifications yet
            </Typography.Body>
          ) : (
            groupedNotifications.map((group, index) => (
              <Notifications.NotificationGroup key={index} group={group} />
            ))
          )}
        </Notifications.Root>
        <Sidebar className="self-start sticky top-[120px] hidden xl:block w-[20%]">
          <WhoFollow />
          <HotTags />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <CreatePost />
    </Content.Main>
  );
}
