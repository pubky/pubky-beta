'use client';

import { Content } from '@social/ui-shared';

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

export default function Index() {
  const { notifications, loading } = useNotificationsContext();

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Notifications" />
      <Content.Grid className="flex w-full justify-between items-start gap-12">
        <Notifications.Root>
          {loading ? (
            <Skeleton.Simple />
          ) : (
            notifications.map((notification, index) => (
              <Notifications.Notification
                key={index}
                notification={notification}
              />
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
