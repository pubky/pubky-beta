'use client';

import { Content } from '@social/ui-shared';
import { CreatePost, Feedback, Header, Sidebar, WhoFollow } from '@/components';
import * as Components from '@/components';
import Skeletons from '@/components/Skeletons';
import Filter from '@/components/Filter';
import { useHotTags } from '@/hooks/useTag';
import React from 'react';
import { useStreamPost, useStreamUsers } from '@/hooks/useStream';
import { usePubkyClientContext } from '@/contexts';
import { Hot } from '.';
import { PostView } from '@/types/Post';

export default function Index() {
  const { pubky } = usePubkyClientContext();
  const { data, isLoading, isError } = useHotTags();
  const {
    data: influencers,
    isLoading: isLoadingInfluencers,
    isError: isErrorInfluencers,
  } = useStreamUsers(pubky ?? '', pubky ?? '', 'pioneers');
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = useStreamPost(
    pubky ?? '',
    'all',
    undefined,
    5,
    undefined,
    undefined,
    undefined,
    'popularity',
  );
  const hotTags = data || [];
  if (isError || isErrorInfluencers || isErrorPosts) console.error(isError);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Hot" />
      <Content.Grid className="flex gap-6">
        <Sidebar className="w-[280px] self-start sticky top-[120px] hidden lg:block">
          <Filter.HotTagsReach />
          <Filter.TagsTimeFrame />
        </Sidebar>
        <div className="flex-col inline-flex gap-3 w-full">
          {isLoading || isLoadingInfluencers || isLoadingPosts ? (
            <div className="w-full">
              <Skeletons.Simple />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <Hot.RenderTags hotTags={hotTags} loadingReachTags={isLoading} />
              <Hot.RenderInfluencers
                influencers={influencers}
                initLoadingInfluencers={isLoadingInfluencers}
              />
              <Hot.RenderPosts
                posts={posts as PostView[]}
                initloadingPosts={isLoadingPosts}
              />
            </div>
          )}
        </div>
        <Sidebar className="w-[280px] hidden xl:block">
          <WhoFollow />
          <Feedback />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <Components.FooterMobile title="HotTags" />
    </Content.Main>
  );
}
