'use client';

import { Content, Typography } from '@social/ui-shared';
import { useNotificationsContext, usePubkyClientContext } from '@/contexts';
import { CreatePost, Header, HotTags, Sidebar, Skeleton, WhoFollow } from '@/components';
import Notifications from './_Notification';
import Root from './_Root';
import { useState, useEffect } from 'react';
import { NotificationView } from '@/types/User';

export default function Index() {
  const { putTimestampNotification } = usePubkyClientContext();
  const { notifications, loading, profilesLoading } = useNotificationsContext();
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    const PutTimestamp = async () => {
      await putTimestampNotification();
    };
    PutTimestamp();
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoadingNotifications(loading);
    }
  }, [loading]);

  function renderNotifications(notifications: NotificationView[], loadingNotifications: boolean) {
    if (loadingNotifications || profilesLoading) {
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
      return <Notifications key={index} notification={notification} />;
    });
  }

  return (
    <Content.Main>
      <Header title="Notifications" />
      <Content.Grid className="flex w-full justify-between items-start gap-12">
        <Root>{renderNotifications(notifications, loadingNotifications)}</Root>
        <Sidebar className="self-start sticky top-[120px] hidden xl:block w-[20%]">
          <WhoFollow />
          <HotTags />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
