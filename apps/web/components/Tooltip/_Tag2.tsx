'use client';

import { useEffect, useState } from 'react';
import { Tooltip as TooltipUI, PostUtil } from '@social/ui-shared';
import { ITaggedPost, ITaggedProfile } from '@/types';
import Image from 'next/image';
import Tooltip from '.';

interface TagProps {
  tags: ITaggedPost;
  setShowModalTags: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTag?: React.Dispatch<
    React.SetStateAction<ITaggedPost | ITaggedProfile | null>
  >;
}

export default function Tag2({
  tags,
  setShowModalTags,
  setSelectedTag,
}: TagProps) {
  const [showTooltipProfile, setShowTooltipProfile] = useState<number | null>(
    null
  );
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const images = tags.from.map((fromItem) => {
    if (fromItem.author?.profile?.image === null) {
      return '/images/Userpic.png';
    }
    return fromItem.author?.profile?.image;
  });
  const displayedImages = images.slice(0, 4);
  const extraImagesCount = images.length - displayedImages.length;

  useEffect(() => {
    if (tags?.count) {
      setLoadingFollowers(false);
    }
  }, [tags]);

  return (
    <TooltipUI.Main className="z-40 w-full min-w-[250px] shadow-none px-0 pt-5 pb-0 bg-transparent border-0 cursor-default -translate-x-[12%] translate-y-[70px]">
      <div className="flex gap-6 justify-start w-full">
        {loadingFollowers ? (
          <></>
        ) : (
          // <div className="flex w-full justify-center min-h-[64px] items-center">
          //   <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          // </div>
          <div
            //onClick={() => {
            //  setShowModalTags(true);
            //  setSelectedTag && setSelectedTag(tags);
            //}}
            className="cursor-pointer flex items-center"
          >
            {displayedImages.map((image, imageIndex) => (
              <>
                <Image
                  width={32}
                  height={32}
                  key={imageIndex}
                  onClick={() => setShowTooltipProfile(imageIndex)}
                  className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                    imageIndex > 0 && '-ml-2'
                  }`}
                  alt={`tag-${imageIndex + 1}`}
                  src={image ? image : '/images/Userpic.png'}
                />

                {showTooltipProfile === imageIndex && (
                  <Tooltip.Profile post={tags.from[imageIndex]} />
                )}
              </>
            ))}
            {extraImagesCount > 0 && (
              <PostUtil.Counter className="-ml-2">
                +{extraImagesCount}
              </PostUtil.Counter>
            )}
          </div>
        )}
      </div>
    </TooltipUI.Main>
  );
}
