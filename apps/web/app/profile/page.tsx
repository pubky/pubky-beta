'use client';

import { useEffect, useRef, useState } from 'react';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import { CreatePost, Header, PostsLayout } from '@/components';
import { Profile } from './components';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { TStatus } from '@/types';

export default function Index() {
  const { pubky, putTimestampNotification } = usePubkyClientContext();
  const [activeTab, setActiveTab] = useState(0);
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
        <Content.Grid className="pb-4 md:pb-12 flex flex-col text-center lg:flex-row items-center gap-4 md:gap-8 relative">
          <Profile.FilterTabsMobile
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            countContacts={{
              followers: user?.counts?.followers ?? 0,
              following: user?.counts?.following ?? 0,
              friends: user?.counts?.friends ?? 0,
            }}
            countPosts={user?.counts?.posts}
            loading={isLoading}
            profile={user}
          />
          <div className="w-full rounded-2xl p-6 md:p-0 bg-white md:bg-transparent bg-opacity-10 flex flex-col text-center lg:flex-row items-center gap-8 relative">
            <Profile.Avatar
              username={user?.details?.name || 'Loading...'}
              uriImage={user?.details?.image as string}
            />
            <Profile.Handle
              className="-mt-4"
              username={user?.details?.name || 'Loading...'}
              bio={user?.details?.bio || 'No bio.'}
              pubkey={pubky ? pubky : ''}
              status={(user?.details?.status as TStatus) || 'noStatus'}
            />
          </div>
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-5 gap-2">
        <PostsLayout className="flex flex-col col-span-5 xl:col-span-4 gap-3 mt-[10px]">
          <Profile.FilterTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
      <Components.FooterMobile title="Profile" />
      <div ref={loader} />
    </Content.Main>
  );
}
