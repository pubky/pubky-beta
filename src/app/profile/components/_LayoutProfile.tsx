'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Content } from '@social/ui-shared';
import * as Components from '@/components';
import { CreatePost, PostsLayout } from '@/components';
import { Profile } from '.';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '@/components/ImageByUri';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function LayoutProfile({ children }: { children: React.ReactNode }) {
  const { pubky, profile } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const { data: userData } = useUserProfile(pubky ?? '', pubky ?? '');

  const shouldShowAvatarSection = () => {
    const foundTab = Profile.FilterTabs.tabs.find((tab) => tab.id === activeTab);
    return foundTab?.key === 'tagged' || !isMobile;
  };

  const loader = useRef(null);
  const pathname = usePathname();
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const pathSegments = pathname?.split('/');
    const lastSegment = pathSegments?.pop();
    const foundTab = Profile.FilterTabs.tabs.find((tab) => tab.key === lastSegment);
    setActiveTab(foundTab ? foundTab.id : 0);
    setLoading(false);
  }, [pathname]);

  return (
    <Content.Main>
      <Profile.Header />
      <div>
        <Content.Grid className="pb-4 flex flex-col text-center lg:flex-row items-center gap-4 md:gap-8 relative">
          <Profile.FilterTabsMobile
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userCounts={userData?.counts}
            loading={loading}
            setLoading={setLoading}
          />
          {shouldShowAvatarSection() && (
            <div className="w-full rounded-2xl p-6 lg:p-0 bg-white lg:bg-transparent bg-opacity-10 flex flex-col text-center lg:flex-row items-center gap-3 lg:gap-12 relative">
              <Profile.Avatar
                id={pubky}
                className="lg:pl-12 cursor-pointer"
                username={profile?.name || Utils.minifyPubky(pubky ?? '')}
                onClick={() => setIsAvatarOpen(true)}
              />

              <Profile.Handle className="md:pt-5" profileUser={userData} pubkey={pubky ?? ''} />
            </div>
          )}
        </Content.Grid>
      </div>
      <Content.Grid className="flex xl:gap-2 lg:mt-6">
        <PostsLayout className="flex flex-col w-full gap-3 mt-[10px]">
          <Profile.FilterTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loading}
            setLoading={setLoading}
            userCounts={userData?.counts}
          >
            {children}
          </Profile.FilterTabs>
        </PostsLayout>
        <Profile.Sidebar activeTab={activeTab} />
      </Content.Grid>
      <CreatePost />
      <Components.FooterMobile title="Profile" />
      <div ref={loader} />

      {isAvatarOpen && (
        <div
          onClick={() => setIsAvatarOpen(false)}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
        >
          <div onClick={(event) => event?.stopPropagation()} className="relative p-4 bg-transparent rounded-full">
            <ImageByUri
              id={pubky}
              alt={profile?.name || Utils.minifyPubky(pubky ?? '')}
              width={362}
              height={362}
              className="rounded-full shadow-[0px_20px_40px_0px_rgba(5,5,10,0.50)]"
            />
          </div>
        </div>
      )}
    </Content.Main>
  );
}
