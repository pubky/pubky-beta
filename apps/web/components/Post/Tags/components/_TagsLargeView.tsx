'use client';

import Tooltip from '@/components/Tooltip';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import {
  Button,
  Icon,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import React, { useState } from 'react';
import { useTagsLogic } from './TagsUtils';
import { PubkyAppPostKind } from 'pubky-app-specs';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';

interface TagsProps {
  post: PostView;
}

export default function TagsLargeView({ post }: TagsProps) {
  const [showTooltipPostChecked, setShowTooltipPostChecked] = useState('');
  const isArticle =
    String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase();
  const {
    tags,
    profileImages,
    loadingTags,
    handleAddTag,
    handleDeleteTag,
    openModal,
    isMobile,
  } = useTagsLogic(post);
  const { pubky } = usePubkyClientContext();

  return (
    <>
      <div className="relative flex items-center gap-0 mb-4">
        {isArticle ? (
          <div className="flex gap-3 items-center">
            <Icon.Tag size="14" color="gray" />
            <Typography.Label className="text-opacity-30">
              Tags Article
            </Typography.Label>
          </div>
        ) : (
          <PostUI.Time className="grow-0 justify-start">
            {Utils.timeAgo(post?.details?.indexed_at, isMobile)}
          </PostUI.Time>
        )}
        {post?.details?.author === pubky && !isArticle && (
          <TooltipUI.Root
            delay={50}
            tagId="1"
            setShowTooltip={setShowTooltipPostChecked}
          >
            <div
              id="post-status"
              className="inline-flex items-center ml-2 top-[7px] relative"
            >
              <Icon.Check size="20" color="#00BA7C" />
              <div
                id={
                  post?.cached === 'nexus' || post?.cached === undefined
                    ? 'post-status-indexed'
                    : 'post-status-unindexed'
                }
                className="relative right-[10px]"
              >
                <Icon.Check
                  size="20"
                  color={
                    post?.cached === 'nexus' || post?.cached === undefined
                      ? '#00BA7C'
                      : '#A3A3A3'
                  }
                  opacity={
                    post?.cached === 'nexus' || post?.cached === undefined
                      ? 1
                      : 0.2
                  }
                />
              </div>
            </div>
            {showTooltipPostChecked && !isMobile && (
              <Tooltip.CheckedPost cached={post?.cached} />
            )}
          </TooltipUI.Root>
        )}
      </div>
      <div className="flex-col inline-flex gap-2 overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-webkit">
        {tags.map((tagObj, index) => {
          const isTagFound = tagObj?.relationship || false;

          const displayedImages = tagObj?.taggers
            .slice(0, 4)
            .map((fromItem) => profileImages[fromItem])
            .filter(Boolean);

          const extraImagesCount =
            tagObj?.taggers_count - displayedImages.length;

          return (
            <React.Fragment key={`${index}-${tagObj?.label}`}>
              <PostUI.Footer>
                <div className="flex gap-2">
                  <PostUtil.Tag
                    id={`tag-${index}`}
                    clicked={isTagFound}
                    color={
                      tagObj?.label && Utils.generateRandomColor(tagObj?.label)
                    }
                    onClick={() =>
                      pubky
                        ? isTagFound
                          ? handleDeleteTag(tagObj?.label)
                          : handleAddTag(tagObj?.label)
                        : openModal('join')
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(tagObj?.label, 20)}
                      {loadingTags === tagObj?.label ? (
                        <Icon.LoadingSpin size="12" />
                      ) : (
                        <Typography.Caption
                          id={`tag-${index}-count`}
                          variant="bold"
                          className="text-opacity-60"
                        >
                          {tagObj?.taggers_count}
                        </Typography.Caption>
                      )}
                    </div>
                  </PostUtil.Tag>
                  <Link href={pubky ? `/search?tags=${tagObj?.label}` : ''}>
                    <Button.Action
                      variant="custom"
                      size="small"
                      icon={<Icon.MagnifyingGlassLeft size="14" />}
                      className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                    />
                  </Link>
                </div>
                <div className="flex">
                  {displayedImages.map((image, imageIndex) => (
                    <ImageByUri
                      width={32}
                      height={32}
                      key={imageIndex}
                      className={`min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] rounded-full shadow justify-center items-center flex ${
                        imageIndex > 0 && '-ml-2'
                      }`}
                      alt={`tag-${imageIndex + 1}`}
                      uri={image}
                    />
                  ))}
                  {extraImagesCount > 0 && (
                    <PostUtil.Counter className="-ml-2">
                      +{extraImagesCount}
                    </PostUtil.Counter>
                  )}
                </div>
              </PostUI.Footer>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}
