'use client';

import { useRouter } from 'next/navigation';
import { Content, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import {
  Influencers,
  CreatePost,
  Feedback,
  Header,
  Sidebar,
  WhoFollow,
} from '@/components';
import { HotTags } from './components';
import Skeletons from '@/components/Skeletons';
import Filter from '@/components/Filter';
import { HotTag } from '@/types/Tag';
import { useHotTags } from '@/hooks/useTag';
import { UserProfileForTag } from './components/_UserProfileForTag';
import React from 'react';

export default function Index() {
  const router = useRouter();
  const { data, isLoading, isError } = useHotTags(0, 10);
  const hotTags = data || [];
  if (isError) console.error(isError);

  function renderTags(hotTags: HotTag[], loadingReachTags: boolean) {
    if (loadingReachTags) {
      return <Skeletons.Simple />;
    }

    const firstThreeTags = hotTags.slice(0, 3);
    const otherTags = hotTags.slice(3);

    return (
      <>
        {firstThreeTags.length > 0 && (
          <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
            {firstThreeTags.map((tag, index) => (
              <div
                key={index}
                className="w-full p-6 flex flex-col gap-2 rounded-lg border border-white border-opacity-20"
              >
                <div className="flex gap-2">
                  <PostUtil.Counter>{index + 1}</PostUtil.Counter>
                  <PostUtil.Tag
                    onClick={() => router.push(`/search?tags=${tag?.label}`)}
                    color={tag?.label && Utils.generateRandomColor(tag?.label)}
                    boxShadow={false}
                    clicked={false}
                  >
                    {tag?.label}
                  </PostUtil.Tag>
                </div>
                <Typography.Body className="text-opacity-80" variant="small">
                  {tag?.post_count} posts this month
                </Typography.Body>
                <div className="flex items-center">
                  {tag?.taggers_id.slice(0, 5).map((fromItem, fromIndex) => (
                    <div
                      key={fromIndex}
                      className={fromIndex !== 0 ? '-ml-2' : ''}
                    >
                      <UserProfileForTag userId={fromItem} />
                    </div>
                  ))}
                  {tag?.taggers_id.length > 5 && (
                    <PostUtil.Counter className="-ml-2">
                      +{tag?.taggers_id.length - 5}
                    </PostUtil.Counter>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {otherTags.length > 0 &&
          otherTags.map((tag, index) => (
            <div className="flex gap-3" key={index + 3}>
              <HotTags.Rank
                tag={tag?.label}
                onClick={() => router.push(`/search?tags=${tag?.label}`)}
                color={tag?.label && Utils.generateRandomColor(tag?.label)}
                counter={`${tag?.post_count}`}
                boxShadow={false}
              />
              {tag?.taggers_id.slice(0, 15).map((fromItem, fromIndex) => (
                <div key={fromIndex} className={fromIndex !== 0 ? '-ml-5' : ''}>
                  <UserProfileForTag userId={fromItem} />
                </div>
              ))}
            </div>
          ))}
      </>
    );
  }

  return (
    <Content.Main>
      <Header className="hidden md:block" title="HotTags" />
      <Content.Grid className="grid grid-cols-5 gap-4">
        <Sidebar className="self-start sticky top-[120px] hidden xl:block">
          <Filter.HotTagsReach disabled />
          <Filter.TagsTimeFrame disabled />
        </Sidebar>
        <div className="w-full flex-col inline-flex gap-3 col-span-5 xl:col-span-4 2xl:col-span-3">
          {isLoading ? (
            <div className="w-full">
              <Skeletons.Simple />
            </div>
          ) : (
            renderTags(hotTags, isLoading)
          )}
        </div>
        <Sidebar className="hidden 2xl:block">
          <WhoFollow />
          <Influencers />
          <Feedback />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
