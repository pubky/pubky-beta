'use client';

import { Content } from '@social/ui-shared';
import { CreatePost, Feedback, Sidebar, WhoFollow } from '@/components';
import * as Components from '@/components';
import Skeletons from '@/components/Skeletons';
import Filter from '@/components/Filter';
import { useHotTags } from '@/hooks/useTag';
import React, { useEffect, useState } from 'react';
import { useStreamUsers } from '@/hooks/useStream';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { Hot } from '.';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUser';

export default function Index() {
  const { pubky } = usePubkyClientContext();
  const { hotTagsReach, timeframe } = useFilterContext();
  const isMobile = useIsMobile(1024);
  const pathname = usePathname();
  const { data: userDetails } = useUserProfile(pubky ?? '', pubky ?? '');
  const userId = userDetails?.counts?.following ? pubky : undefined;
  const { data, isLoading, isError } = useHotTags(pubky, hotTagsReach, undefined, undefined, undefined, timeframe);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const {
    data: influencers,
    isLoading: isLoadingInfluencers,
    isError: isErrorInfluencers
  } = useStreamUsers(userId, pubky ?? '', 'influencers', undefined, showMoreUsers ? 20 : 5, hotTagsReach, timeframe);
  const hotTags = data || [];
  if (isError || isErrorInfluencers) console.warn(isError && isErrorInfluencers);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    switch (hash) {
      case 'popular':
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
          <div className="flex flex-col gap-6">
            {isMobile ? (
              <>
                {activeTab === 0 &&
                  (isLoading ? (
                    <Skeletons.Simple />
                  ) : (
                    <Hot.RenderTags hotTags={hotTags} loadingReachTags={isLoading} />
                  ))}
                {activeTab === 1 &&
                  (isLoadingInfluencers ? (
                    <Skeletons.Simple />
                  ) : (
                    <Hot.RenderInfluencers
                      influencers={influencers}
                      initLoadingInfluencers={isLoadingInfluencers}
                      showMoreUsers={showMoreUsers}
                      setShowMoreUsers={setShowMoreUsers}
                    />
                  ))}
                {activeTab === 2 && <Hot.RenderPosts />}
              </>
            ) : (
              <>
                {isLoading ? <Skeletons.Simple /> : <Hot.RenderTags hotTags={hotTags} loadingReachTags={isLoading} />}
                {isLoadingInfluencers ? (
                  <Skeletons.Simple />
                ) : (
                  <Hot.RenderInfluencers
                    influencers={influencers}
                    initLoadingInfluencers={isLoadingInfluencers}
                    showMoreUsers={showMoreUsers}
                    setShowMoreUsers={setShowMoreUsers}
                  />
                )}
                <Hot.RenderPosts />
              </>
            )}
          </div>
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
