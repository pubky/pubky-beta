'use client';

import { useEffect, useState } from 'react';
import { Content } from '@social/ui-shared';

import { useClientContext } from '@/contexts';
import { INotification } from '@/types';
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
  const { getNotifications } = useClientContext();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const results = await getNotifications();
      console.log('results', results);
      if (results) setNotifications(results.feed);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
