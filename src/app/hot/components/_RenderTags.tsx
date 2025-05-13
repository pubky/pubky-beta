'use client';

import { useState } from 'react';
import Skeletons from '@/components/Skeletons';
import { PostUtil, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { HotTag } from '@/types/Tag';
import { Hot } from '.';
import Link from 'next/link';
import { useFilterContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';

interface RenderTagsProps {
  hotTags: HotTag[];
  loadingReachTags: boolean;
}

const RenderTags = ({ hotTags, loadingReachTags }: RenderTagsProps) => {
  const { timeframe } = useFilterContext();
  const isMobile = useIsMobile(640);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const numberImagesUser = isMobile ? 3 : 5;
  const timeframeLabel = timeframe === 'all_time' ? 'all time' : timeframe === 'this_month' ? 'this month' : 'today';

  if (loadingReachTags) {
    return <Skeletons.Simple />;
  }

  const firstThreeTags = hotTags.slice(0, 3);
  const otherTags = hotTags.slice(3);

  return (
    <div className="flex flex-col gap-3">
      <Typography.H2 className="hidden lg:block text-opacity-50 font-light">Hot Tags</Typography.H2>
      {hotTags.length === 0 && (
        <Typography.Body className="text-center mt-6 text-opacity-50 lg:text-left lg:mt-0 lg:text-[15px]">
          No tags to show
        </Typography.Body>
      )}
      {firstThreeTags.length > 0 && (
        <div className="w-full flex flex-col md:flex-row gap-3">
          {firstThreeTags.map((tag, index) => {
            const baseColor = Utils.generateRandomColor(tag?.label);
            const backgroundColor = Utils.hexToRgba(baseColor, hoveredIndex === index ? 0.6 : 0.3);

            return (
              <Link
                key={index}
                href={`/search?tags=${tag?.label}`}
                style={{
                  backgroundColor,
                  transition: 'background-color 0.3s ease-in-out'
                }}
                className="w-full p-6 flex flex-col gap-2 rounded-lg"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="w-full flex md:flex-col gap-4 md:gap-2 justify-between md:justify-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <PostUtil.Counter className="bg-transparent">{index + 1}</PostUtil.Counter>
                      <Typography.Body className="break-words" variant="large-bold">
                        {Utils.minifyText(tag?.label, 21)}
                      </Typography.Body>
                    </div>
                    <Typography.Body className="text-opacity-80" variant="medium">
                      {tag?.tagged_count} posts {timeframeLabel}
                    </Typography.Body>
                  </div>
                  <div className="flex">
                    {tag?.taggers_id.slice(0, numberImagesUser).map((fromItem, fromIndex) => (
                      <div key={fromIndex} className={fromIndex !== 0 ? '-ml-2' : ''}>
                        <Hot.UserProfileForTag userId={fromItem} />
                      </div>
                    ))}
                    {tag?.taggers_id.length > 5 && (
                      <PostUtil.Counter className="-ml-2">
                        +{tag?.taggers_id.length - numberImagesUser}
                      </PostUtil.Counter>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {otherTags.length > 0 &&
          otherTags.map((tag, index) => (
            <SideCard.Rank
              key={index}
              href={`/search?tags=${tag?.label}`}
              rank={index + 1}
              tag={Utils.minifyText(tag?.label, 21)}
              color={tag?.label && Utils.generateRandomColor(tag?.label)}
              counter={`${tag?.tagged_count}`}
              boxShadow={false}
            />
          ))}
      </div>
    </div>
  );
};

export default RenderTags;
