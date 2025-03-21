'use client';

import { useEffect, useState } from 'react';
import { Tooltip as TooltipUI, PostUtil } from '@social/ui-shared';
import Tooltip from '.';
import { ImageByUri } from '../ImageByUri';
import { PostTag } from '@/types/Post';
import { getUserProfile } from '@/services/userService';
import { usePubkyClientContext } from '@/contexts';

interface TagProps {
  tags: PostTag | null;
}

export default function Tag2({ tags }: TagProps) {
  const { pubky } = usePubkyClientContext();
  const [showTooltipProfile, setShowTooltipProfile] = useState<number | null>(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (tags?.taggers) {
        const fetchedImages = await Promise.all(
          tags.taggers.map(async (fromItem) => {
            return fromItem;
          })
        );
        setImages(fetchedImages);
      }
      setLoadingFollowers(false);
    };

    fetchUserProfiles();
  }, [tags, pubky]);

  const displayedImages = images?.slice(0, 4);
  const extraImagesCount = tags && tags?.taggers_count - displayedImages?.length;

  return (
    <TooltipUI.Main className="z-40 w-auto left-auto shadow-none px-0 pt-[5px] pb-0 bg-transparent border-0 cursor-default -translate-x-0 translate-y-[70px]">
      <div className="flex gap-6 justify-start w-full">
        {loadingFollowers ? (
          <></>
        ) : (
          <div className="cursor-pointer flex items-center">
            {displayedImages?.map((image, imageIndex) => (
              <div key={imageIndex}>
                <ImageByUri
                  id={image}
                  width={32}
                  height={32}
                  key={imageIndex}
                  onClick={() => setShowTooltipProfile(imageIndex)}
                  className={`max-w-none w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                    imageIndex > 0 && '-ml-2'
                  }`}
                  alt={`tag-${imageIndex + 1}`}
                />

                {showTooltipProfile === imageIndex && <Tooltip.Profile profileId={tags?.taggers[imageIndex]} />}
              </div>
            ))}
            {!loadingFollowers && Number(extraImagesCount) > 0 && (
              <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>
            )}
          </div>
        )}
      </div>
    </TooltipUI.Main>
  );
}
