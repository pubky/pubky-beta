'use client';

import { useEffect, useRef, useState } from 'react';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import { CreatePost, Header, PostsLayout } from '@/components';
import { Profile } from '../components';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

export default function Index() {
  const { pubky, putTimestampNotification, profile } = usePubkyClientContext();
  const [activeTab, setActiveTab] = useState(0);
  const { data: userData, isLoading } = useUserProfile(
    pubky ?? '',
    pubky ?? '',
  );
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
        <Content.Grid className="pb-4 flex flex-col text-center lg:flex-row items-center gap-4 md:gap-8 relative">
          <Profile.FilterTabsMobile
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userCounts={userData?.counts}
            userTags={userData?.tags.length}
            loading={isLoading}
          />
          <div className="w-full rounded-2xl p-6 lg:p-0 bg-white lg:bg-transparent bg-opacity-10 flex flex-col text-center lg:flex-row items-center gap-3 lg:gap-12 relative">
            <Profile.Avatar
              className="lg:pl-12"
              username={profile?.name || Utils.minifyPubky(pubky ?? '')}
              uriImage={profile?.image as string}
            />
            <Profile.Handle
              profileUser={userData}
              pubkey={pubky ? pubky : ''}
            />
          </div>
        </Content.Grid>
      </div>
      <Content.Grid className="flex gap-2">
        <PostsLayout className="flex flex-col w-full gap-3 mt-[10px]">
          <Profile.FilterTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userCounts={userData?.counts}
            userTags={userData?.tags.length}
            loading={isLoading}
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
