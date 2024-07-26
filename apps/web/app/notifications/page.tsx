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

export default function Index() {
  const { notifications, loading } = useNotificationsContext();
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    if (!loading) setLoadingNotifications(loading);
  }, [loading]);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Notifications" />
      <Content.Grid className="flex w-full justify-between items-start gap-12">
        <Notifications.Root>
          {loadingNotifications ? (
            <Skeleton.Simple />
          ) : notifications.length === 0 ? (
            <Typography.Body variant="small" className="text-opacity-50">
              No notifications yet
            </Typography.Body>
          ) : (
            notifications.map((notification, index) => {
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
            })
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
