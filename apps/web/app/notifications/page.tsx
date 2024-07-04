'use client';

import { useEffect } from 'react';
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

export default function Index() {
  const { getNotifications } = useClientContext();

  const fetchNotifications = async () => {
    const data = await getNotifications();
    console.log("notifications", data);
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Notifications" />
      <Content.Grid className="flex w-full justify-between items-start gap-12">
        <Notifications.Root>
          <Notifications.Notification />
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
