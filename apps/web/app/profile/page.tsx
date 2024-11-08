'use client';

import { useEffect, useRef } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, PostsLayout } from '@/components';
import { Profile } from './components';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { TStatus } from '@/types';

export default function Index() {
  const { pubky, putTimestampNotification } = usePubkyClientContext();
  const { data: user, isLoading } = useUserProfile(pubky ?? '', pubky ?? '');
  const loader = useRef(null);
  const timestamp = Date.now();

  useEffect(() => {
    const PutTimestamp = async () => {
      await putTimestampNotification(timestamp);
    };
    PutTimestamp();
  }, []);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Profile" />
      <div>
        <Content.Grid className="flex flex-col text-center lg:flex-row items-center gap-8 relative">
          <Profile.Avatar
            username={user?.details?.name || 'Loading...'}
            uriImage={user?.details?.image as string}
          />
          <Profile.Handle
            className="-mt-4"
            username={user?.details?.name || 'Loading...'}
            pubkey={pubky ? pubky : ''}
            status={(user?.details?.status as TStatus) || 'noStatus'}
          />
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-5 gap-2">
        <PostsLayout className="flex flex-col col-span-5 xl:col-span-4 gap-3 mt-[10px]">
          <Profile.FilterTabs
            countContacts={{
              followers: user?.counts?.followers ?? 0,
              following: user?.counts?.following ?? 0,
              friends: user?.counts?.friends ?? 0,
            }}
            countPosts={user?.counts?.posts}
            loading={isLoading}
            profile={user}
          />
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
