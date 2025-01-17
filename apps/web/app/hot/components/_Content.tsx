'use client';

import { Content } from '@social/ui-shared';
import { CreatePost, Feedback, Sidebar, WhoFollow } from '@/components';
import * as Components from '@/components';
import Skeletons from '@/components/Skeletons';
import Filter from '@/components/Filter';
import { useHotTags } from '@/hooks/useTag';
import React, { useEffect, useState } from 'react';
import { useStreamUsers } from '@/hooks/useStream';
import { usePubkyClientContext } from '@/contexts';
import { Hot } from '.';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePathname } from 'next/navigation';

export default function Index() {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile(1024);
  const pathname = usePathname();
  const { data, isLoading, isError } = useHotTags();
  const {
    data: influencers,
    isLoading: isLoadingInfluencers,
    isError: isErrorInfluencers,
  } = useStreamUsers(pubky ?? '', pubky ?? '', 'pioneers', undefined, 5);
  const hotTags = data || [];
  if (isError || isErrorInfluencers)
    console.error(isError && isErrorInfluencers);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    switch (hash) {
      case 'influencers':
        setActiveTab(1);
        break;
      case 'posts':
        setActiveTab(2);
        break;
      default:
        setActiveTab(0);
    }
  }, [pathname]);

  return (
    <Content.Main className="pt-[90px]">
      <Hot.Header />
      <Content.Grid className="flex gap-6">
        <Sidebar className="w-[280px] self-start sticky top-[120px] hidden lg:block">
          <Filter.HotTagsReach />
          <Filter.TagsTimeFrame />
        </Sidebar>
        <div className="flex-col inline-flex gap-3 w-full">
          <Hot.TabsMobile
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={isLoading || isLoadingInfluencers}
          />
          {isLoading || isLoadingInfluencers ? (
            <div className="w-full">
              <Skeletons.Simple />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {isMobile ? (
                <>
                  {activeTab === 0 && (
                    <Hot.RenderTags
                      hotTags={hotTags}
                      loadingReachTags={isLoading}
                    />
                  )}
                  {activeTab === 1 && (
                    <Hot.RenderInfluencers
                      influencers={influencers}
                      initLoadingInfluencers={isLoadingInfluencers}
                    />
                  )}
                  {activeTab === 2 && <Hot.RenderPosts />}
                </>
              ) : (
                <>
                  <Hot.RenderTags
                    hotTags={hotTags}
                    loadingReachTags={isLoading}
                  />
                  <Hot.RenderInfluencers
                    influencers={influencers}
                    initLoadingInfluencers={isLoadingInfluencers}
                  />
                  <Hot.RenderPosts />
                </>
              )}
            </div>
          )}
        </div>
        <Sidebar className="w-[280px] hidden xl:block self-start sticky top-[100px]">
          <WhoFollow />
          <Feedback />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <Components.FooterMobile title="HotTags" />
    </Content.Main>
  );
}
