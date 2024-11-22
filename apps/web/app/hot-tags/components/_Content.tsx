'use client';

import { Content } from '@social/ui-shared';
import {
  Influencers,
  CreatePost,
  Feedback,
  Header,
  Sidebar,
  WhoFollow,
} from '@/components';
import * as Components from '@/components';
import Skeletons from '@/components/Skeletons';
import Filter from '@/components/Filter';
import { useHotTags } from '@/hooks/useTag';
import React from 'react';
import { HotTags } from '.';

export default function Index() {
  const { data, isLoading, isError } = useHotTags();
  const hotTags = data || [];
  if (isError) console.error(isError);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="HotTags" />
      <Content.Grid className="flex gap-6">
        <Sidebar className="w-[280px] self-start sticky top-[120px] hidden lg:block">
          <Filter.HotTagsReach />
          <Filter.TagsTimeFrame />
        </Sidebar>
        <div className="flex-col inline-flex gap-3 w-full">
          {isLoading ? (
            <div className="w-full">
              <Skeletons.Simple />
            </div>
          ) : (
            <HotTags.RenderTags
              hotTags={hotTags}
              loadingReachTags={isLoading}
            />
          )}
        </div>
        <Sidebar className="w-[280px] hidden xl:block">
          <WhoFollow />
          <Influencers />
          <Feedback />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <Components.FooterMobile title="HotTags" />
    </Content.Main>
  );
}
