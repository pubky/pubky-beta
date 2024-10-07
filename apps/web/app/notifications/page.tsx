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
import { NotificationView } from '@/types/User';

export default function Index() {
  const { notifications, loading } = useNotificationsContext();
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    if (!loading) {
      setLoadingNotifications(loading);
    }
  }, [loading]);

  function renderNotifications(
    notifications: NotificationView[],
    loadingNotifications: boolean
  ) {
    if (loadingNotifications) {
      return <Skeleton.Simple />;
    }

    if (notifications.length === 0) {
      return (
        <Typography.Body variant="small" className="text-opacity-50">
          No notifications yet
        </Typography.Body>
      );
    }

    return notifications.map((notification, index) => {
      {
        /**if (Array.isArray(notification)) {
        switch (notification[0].body.type) {
          case 'Follow':
          case 'NewFriend':
          case 'LostFriend':
            return (
              <Notifications.NotificationGroup
                key={index}
                notifications={notification}
              />
            );
          case 'TagProfile':
            return (
              <Notifications.NotificationTagGroup
                key={index}
                notifications={notification}
              />
            );
          case 'TagPost':
            return (
              <Notifications.NotificationTagPostGroup
                key={index}
                notifications={notification}
              />
            );
          default:
            return null;
        }
      } else {
        return (
          <Notifications.Notification key={index} notification={notification} />
        );
      }*/
      }
      return (
        <Notifications.Notification key={index} notification={notification} />
      );
    });
  }

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Notifications" />
      <Content.Grid className="flex w-full justify-between items-start gap-12">
        <Notifications.Root>
          {renderNotifications(notifications, loadingNotifications)}
        </Notifications.Root>
        <Sidebar className="self-start sticky top-[120px] hidden xl:block w-[20%]">
          <WhoFollow />
          <HotTags />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
