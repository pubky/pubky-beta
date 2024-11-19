'use client';

import Skeletons from '@/components/Skeletons';
import { PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';
import { HotTag } from '@/types/Tag';
import { HotTags } from '.';

interface RenderTagsProps {
  hotTags: HotTag[];
  loadingReachTags: boolean;
}

const RenderTags = ({ hotTags, loadingReachTags }: RenderTagsProps) => {
  const router = useRouter();

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
              className="bg-white bg-opacity-10 lg:bg-transparent w-full p-6 flex flex-col gap-2 rounded-lg lg:border lg:border-white lg:border-opacity-20"
            >
              <div className="flex gap-2">
                <PostUtil.Counter className="bg-transparent">
                  {index + 1}
                </PostUtil.Counter>
                <PostUtil.Tag
                  onClick={() => router.push(`/search?tags=${tag?.label}`)}
                  color={tag?.label && Utils.generateRandomColor(tag?.label)}
                  boxShadow={false}
                  clicked={false}
                >
                  {Utils.minifyText(tag?.label, 21)}
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
                    <HotTags.UserProfileForTag userId={fromItem} />
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
                <HotTags.UserProfileForTag userId={fromItem} />
              </div>
            ))}
          </div>
        ))}
    </>
  );
};

export default RenderTags;
