'use client';

import { Content } from '@social/ui-shared';
import {
  CreatePost,
  Header,
  HotTags,
  Sidebar,
  WhoFollow,
} from '../../components';
import { Notifications } from './components';
import { useClientContext } from './../../contexts/client';
import { useEffect } from 'react';

export default function Index() {
  const { getNotifications } = useClientContext();

  const fetchNotifications = async () => {
    const data = await getNotifications();
    console.log(data);
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Notifications" />
      <Content.Grid className="gap-6 flex justify-between">
        <Notifications.Root>
          <Notifications.Notification />
          <Notifications.Notification />
          <Notifications.Notification />
        </Notifications.Root>
        <Sidebar className="hidden xl:flex">
          <WhoFollow />
          <HotTags />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <CreatePost />
    </Content.Main>
  );
}
