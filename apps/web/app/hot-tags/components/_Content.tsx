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
      <Content.Grid className="grid grid-cols-10 gap-4">
        <Sidebar className="col-span-1 self-start sticky top-[120px] hidden lg:block">
          <Filter.HotTagsReach disabled />
          <Filter.TagsTimeFrame disabled />
        </Sidebar>
        <div className="flex-col inline-flex gap-3 col-span-10 lg:col-span-9 xl:col-span-7 lg:ml-[70px] xl:ml-[45px]">
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
        <Sidebar className="col-span-2 hidden xl:block">
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
