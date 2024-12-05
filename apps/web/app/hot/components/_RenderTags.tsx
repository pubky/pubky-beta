'use client';

import Skeletons from '@/components/Skeletons';
import { PostUtil, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { HotTag } from '@/types/Tag';
import { Hot } from '.';
import Link from 'next/link';

interface RenderTagsProps {
  hotTags: HotTag[];
  loadingReachTags: boolean;
}

const RenderTags = ({ hotTags, loadingReachTags }: RenderTagsProps) => {
  if (loadingReachTags) {
    return <Skeletons.Simple />;
  }

  const firstThreeTags = hotTags.slice(0, 3);
  const otherTags = hotTags.slice(3);

  return (
    <div className="flex flex-col gap-3">
      <Typography.H2 className="text-opacity-50 font-light">
        Popular Tags
      </Typography.H2>
      {firstThreeTags.length > 0 && (
        <div className="w-full flex flex-col md:flex-row gap-4">
          {firstThreeTags.map((tag, index) => (
            <div
              key={index}
              style={{
                backgroundColor: Utils.hexToRgba(
                  Utils.generateRandomColor(tag?.label),
                  0.2,
                ),
              }}
              className={`w-full p-6 flex flex-col gap-2 rounded-lg`}
            >
              <div className="flex gap-2">
                <PostUtil.Counter className="bg-transparent">
                  {index + 1}
                </PostUtil.Counter>
                <Link href={`/search?tags=${tag?.label}`}>
                  <PostUtil.Tag
                    color={tag?.label && Utils.generateRandomColor(tag?.label)}
                    boxShadow
                    clicked={false}
                  >
                    {Utils.minifyText(tag?.label, 21)}
                  </PostUtil.Tag>
                </Link>
              </div>
              <Typography.Body className="text-opacity-80" variant="medium">
                {tag?.post_count} posts all time
              </Typography.Body>
              <div className="flex items-center">
                {tag?.taggers_id.slice(0, 5).map((fromItem, fromIndex) => (
                  <div
                    key={fromIndex}
                    className={fromIndex !== 0 ? '-ml-2' : ''}
                  >
                    <Hot.UserProfileForTag userId={fromItem} />
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
      <div className="flex flex-wrap gap-2">
        {otherTags.length > 0 &&
          otherTags.map((tag, index) => (
            <div key={index + 3}>
              <Link key={index} href={`/search?tags=${tag?.label}`}>
                <SideCard.Rank
                  rank={index + 1}
                  tag={Utils.minifyText(tag?.label, 21)}
                  color={tag?.label && Utils.generateRandomColor(tag?.label)}
                  counter={`${tag?.post_count}`}
                  boxShadow={false}
                />
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RenderTags;
