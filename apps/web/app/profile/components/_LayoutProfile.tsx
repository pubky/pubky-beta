'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import { CreatePost, Header, PostsLayout } from '@/components';
import { Profile } from '.';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';

export default function LayoutProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pubky, putTimestampNotification, profile } = usePubkyClientContext();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: userData } = useUserProfile(pubky ?? '', pubky ?? '');
  const loader = useRef(null);
  const timestamp = Date.now();
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const pathSegments = pathname?.split('/');
    const lastSegment = pathSegments?.pop();
    const foundTab = Profile.FilterTabs.tabs.find(
      (tab) => tab.key === lastSegment,
    );
    setActiveTab(foundTab ? foundTab.id : 0);
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const putTimestamp = async () => {
      await putTimestampNotification(timestamp);
    };
    putTimestamp();
  }, [timestamp, putTimestampNotification]);

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
            loading={loading}
            setLoading={setLoading}
          />
          <div className="w-full rounded-2xl p-6 lg:p-0 bg-white lg:bg-transparent bg-opacity-10 flex flex-col text-center lg:flex-row items-center gap-3 lg:gap-12 relative">
            <Profile.Avatar
              className="lg:pl-12"
              username={profile?.name || Utils.minifyPubky(pubky ?? '')}
              uriImage={profile?.image as string}
            />
            <Profile.Handle profileUser={userData} pubkey={pubky ?? ''} />
          </div>
        </Content.Grid>
      </div>
      <Content.Grid className="flex gap-2">
        <PostsLayout className="flex flex-col w-full gap-3 mt-[10px]">
          <Profile.FilterTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loading}
            setLoading={setLoading}
            userCounts={userData?.counts}
            userTags={userData?.tags.length}
          >
            {children}
          </Profile.FilterTabs>
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
      <Components.FooterMobile title="Profile" />
      <div ref={loader} />
    </Content.Main>
  );
}
