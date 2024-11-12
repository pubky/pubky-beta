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
  setShowModalTags: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTag?: React.Dispatch<React.SetStateAction<PostTag | null>>;
}

export default function Tag2({
  tags,
  setShowModalTags,
  setSelectedTag,
}: TagProps) {
  const { pubky } = usePubkyClientContext();
  const [showTooltipProfile, setShowTooltipProfile] = useState<number | null>(
    null
  );
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (tags?.taggers) {
        const fetchedImages = await Promise.all(
          tags.taggers.map(async (fromItem) => {
            const profile = await getUserProfile(fromItem, pubky ?? '');
            return profile?.details?.image ?? '/images/webp/Userpic.webp';
          })
        );
        setImages(fetchedImages);
        setLoadingFollowers(false);
      }
    };

    fetchUserProfiles();
  }, [tags, pubky]);

  const displayedImages = images?.slice(0, 4);
  const extraImagesCount =
    images && displayedImages && images?.length - displayedImages?.length;

  useEffect(() => {
    if (tags?.taggers_count) {
      setLoadingFollowers(false);
    }
  }, [tags]);

  return (
    <TooltipUI.Main className="z-40 w-auto left-auto shadow-none px-0 pt-5 pb-0 bg-transparent border-0 cursor-default -translate-x-0 translate-y-[70px]">
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
            {displayedImages?.map((image, imageIndex) => (
              <div key={imageIndex}>
                <ImageByUri
                  width={32}
                  height={32}
                  key={imageIndex}
                  onClick={() => setShowTooltipProfile(imageIndex)}
                  className={`max-w-none w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                    imageIndex > 0 && '-ml-2'
                  }`}
                  alt={`tag-${imageIndex + 1}`}
                  uri={image ? image : '/images/webp/Userpic.webp'}
                />

                {showTooltipProfile === imageIndex && (
                  <Tooltip.Profile profileId={tags?.taggers[imageIndex]} />
                )}
              </div>
            ))}
            {Number(extraImagesCount) > 0 && (
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
