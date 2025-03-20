'use client';

import { useEffect, useState } from 'react';
import { Icon, Tooltip, Typography, PostUtil } from '@social/ui-shared';
import { ITaggedPost, ITaggedProfile } from '@/types';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '../ImageByUri';
import Link from 'next/link';

interface TagProps {
  tags: ITaggedPost;
  setShowModalTags: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTag?: React.Dispatch<React.SetStateAction<ITaggedPost | ITaggedProfile | null>>;
}

export default function Tag({ tags, setShowModalTags, setSelectedTag }: TagProps) {
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const images = tags.from.map((fromItem) => {
    return fromItem.id;
  });
  const displayedImages = images.slice(0, 4);
  const extraImagesCount = images.length - displayedImages.length;

  useEffect(() => {
    if (tags?.count) {
      setLoadingFollowers(false);
    }
  }, [tags]);

  return (
    <Tooltip.Main className="cursor-default min-w-[250px] translate-y-[0px]">
      <div className="flex gap-6 justify-start w-full">
        {loadingFollowers ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <div className={`w-full flex-col gap-3 inline-flex`}>
            <div className="inline-flex gap-2">
              <Typography.Label>{tags?.count}</Typography.Label>
              <Typography.Label className="text-opacity-50 text-[10px]">Tagged by</Typography.Label>
            </div>
            <div
              onClick={() => {
                setShowModalTags(true);
                setSelectedTag && setSelectedTag(tags);
              }}
              className="cursor-pointer flex items-center"
            >
              {displayedImages.map((image, imageIndex) => (
                <ImageByUri
                  id={image}
                  width={32}
                  height={32}
                  key={imageIndex}
                  className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                    imageIndex > 0 && '-ml-2'
                  }`}
                  alt={`tag-${imageIndex + 1}`}
                />
              ))}
              {extraImagesCount > 0 && <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>}
            </div>
            <Link
              onClick={(event) => {
                event.stopPropagation();
              }}
              href={`/search?tags=${tags.tag}`}
              className="p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 cursor-pointer inline-flex items-center justify-center gap-1"
            >
              <div>
                <Icon.MagnifyingGlass size="16" />
              </div>
              <Typography.Body className="text-center text-opacity-80" variant="small-bold">
                {Utils.minifyText(tags.tag, 20)}
              </Typography.Body>
            </Link>
          </div>
        )}
      </div>
    </Tooltip.Main>
  );
}
