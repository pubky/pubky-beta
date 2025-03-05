'use client';

import { Content, Typography } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { CreatePost, Header, HotTags, Sidebar, Skeleton, WhoFollow } from '@/components';
import Notifications from './_Notification';
import Root from './_Root';
import { useState, useEffect } from 'react';
import { NotificationView } from '@/types/User';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectNotifications,
  selectNotificationsLoading,
  fetchNotifications,
  setTimestamp
} from '@/store/slices/notifications';

export default function Index() {
  const dispatch = useAppDispatch();
  const { putTimestampNotification, pubky, mutedUsers, notificationPreferences, timestamp } = usePubkyClientContext();
  const notifications = useAppSelector(selectNotifications);
  const loading = useAppSelector(selectNotificationsLoading);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  useEffect(() => {
    const updateTimestamp = async () => {
      await putTimestampNotification();
    };
    updateTimestamp();
  }, []);

  useEffect(() => {
    if (timestamp) {
      dispatch(setTimestamp(timestamp));
    }
  }, [timestamp, dispatch]);

  useEffect(() => {
    if (pubky && notificationPreferences) {
      dispatch(
        fetchNotifications({
          pubky,
          mutedUsers,
          notificationPreferences,
          timestamp
        })
      );
    }
  }, [pubky, notificationPreferences, mutedUsers, timestamp, dispatch]);

  useEffect(() => {
    if (!loading) {
      setLoadingNotifications(loading);
    }
  }, [loading]);

  function renderNotifications(notifications: NotificationView[], loadingNotifications: boolean) {
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
