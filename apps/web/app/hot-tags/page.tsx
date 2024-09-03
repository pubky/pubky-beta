'use client';

import { useRouter } from 'next/navigation';
import { Content, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import {
  ActiveFriends,
  CreatePost,
  Feedback,
  Header,
  Sidebar,
  WhoFollow,
} from '@/components';
import { HotTags } from './components';
import Skeletons from '@/components/Skeletons';
import Filter from '@/components/Filter';
import { ImageByUri } from '@/components/ImageByUri';
import { HotTag } from '@/types/Tag';
import { useHotTags } from '@/hooks/useTag';

export default function Index() {
  const router = useRouter();
  const { data, isLoading, isError } = useHotTags(0, 10);
  const hotTags = data || [];
  if (isError) console.error(isError);

  function renderTags(hotTags: HotTag[], loadingReachTags: boolean) {
    if (loadingReachTags) {
      return <Skeletons.Simple />;
    }

    if (hotTags.length > 0) {
      return hotTags.map((tag, index) => {
        //const profiles = tag?.taggers_id
         // .slice(0, 15)
         // .map((fromItem) => useUserProfile(fromItem));

        return (
          <div className="flex gap-3" key={index}>
            <HotTags.Rank
              tag={tag?.label}
              onClick={() => router.push(`/search?tags=${tag?.label}`)}
              color={tag?.label && Utils.generateRandomColor(tag?.label)}
              counter={`${tag?.post_count}`}
              boxShadow={false}
            />
            {tag.taggers_id.map((profile, fromIndex) => (
              <ImageByUri
                width={32}
                height={32}
                alt={`pic-${fromIndex + 1}`}
                key={fromIndex}
                className={`w-[32px] h-[32px] rounded-full ${
                  fromIndex !== 0 ? '-ml-5' : ''
                }`}
                uri={profile?.details?.image || '/images/Userpic.png'}
              />
            ))}
          </div>
        );
      });
    }

    return (
      <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
        <Typography.H2 className="font-normal text-opacity-50">
          No tags yet.
        </Typography.H2>
      </div>
    );
  }

  return (
    <Content.Main>
      <Header className="hidden md:block" title="HotTags" />
      <Content.Grid className="grid grid-cols-5 gap-4">
        <Sidebar className="self-start sticky top-[120px] hidden xl:block">
          <Filter.HotTagsReach />
          <Filter.TagsTimeFrame />
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
          <ActiveFriends />
          <Feedback />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
