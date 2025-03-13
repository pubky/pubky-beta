'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PubkyAppPostKind } from 'pubky-app-specs';

import { usePubkyClientContext, useAlertContext } from '@/contexts';

import { PostView } from '@/types/Post';

import { Button, Icon, Post as PostUI, PostUtil, Tooltip as TooltipUI, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri, Tooltip } from '@/components';
import { InputTagStandard, TagsCommonFunctions } from './components';

import { useIsMobile } from '@/hooks/useIsMobile';
import { getUserProfile } from '@/services/userService';

export function LargeView({ post }: { post: PostView }) {
  const { pubky } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { createTag, deleteTag } = usePubkyClientContext();

  const tooltipRef = useRef(null);
  const isMobile = useIsMobile();

  const [localPost, setLocalPost] = useState(post);
  const [showTooltipPostChecked, setShowTooltipPostChecked] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [showTooltipProfile, setShowTooltipProfile] = useState<{ tagIndex: number; imageIndex: number } | null>(null);
  const [loadingTags, setLoadingTags] = useState('');
  const [profileImages, setProfileImages] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [addTagInput, setAddTagInput] = useState(false);

  const isArticle = String(localPost?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase();

  const fetchProfileImages = async () => {
    const images = {};
    const taggerPromises = post?.tags?.flatMap((tagObj) =>
      tagObj?.taggers
        ?.map((fromItem) => {
          if (fromItem && !images[fromItem]) {
            return getUserProfile(fromItem, pubky ?? '')
              .then((profile) => {
                images[fromItem] = profile?.details?.image || '/images/webp/Userpic.webp';
              })
              .catch(() => {
                images[fromItem] = '/images/webp/Userpic.webp';
              });
          }
          return null;
        })
        .filter(Boolean)
    );

    await Promise.all(taggerPromises);
    setProfileImages(images);
  };

  const handleAddTag = async (tag: string) => {
    await TagsCommonFunctions.handleAddTag(
      tag,
      localPost,
      createTag,
      setLocalPost,
      addAlert,
      tagInput,
      setTagInput,
      setAddTagInput,
      setLoadingTags
    );
  };

  const handleDeleteTag = async (tag: string) => {
    await TagsCommonFunctions.handleDeleteTag(tag, localPost, deleteTag, setLocalPost, addAlert, setLoadingTags);
  };

  useEffect(() => {
    if (localPost?.tags.length > 0) fetchProfileImages();
  }, [localPost?.tags]);

  return (
    <div className="mt-1.5 w-auto cursor-default" onClick={(event) => event.stopPropagation()}>
      <div className="min-w-[380px] flex-col inline-flex gap-0.5">
        <div className="relative flex items-center gap-0 mb-4">
          {isArticle ? (
            <div className="flex gap-3 items-center">
              <Icon.Tag size="14" color="gray" />
              <Typography.Label className="text-opacity-30">Tags Article</Typography.Label>
            </div>
          ) : (
            <PostUI.Time className="grow-0 justify-start">
              {Utils.timeAgo(localPost?.details?.indexed_at, isMobile)}
            </PostUI.Time>
          )}
          {localPost?.details?.author === pubky && !isArticle && (
            <TooltipUI.Root delay={50} tagId="1" setShowTooltip={setShowTooltipPostChecked}>
              <div id="post-status" className="inline-flex items-center ml-2 top-[7px] relative">
                <Icon.Check size="20" color="#00BA7C" />
                <div
                  id={
                    localPost?.cached === 'nexus' || localPost?.cached === undefined
                      ? 'post-status-indexed'
                      : 'post-status-unindexed'
                  }
                  className="relative right-[10px]"
                >
                  <Icon.Check
                    size="20"
                    color={localPost?.cached === 'nexus' || localPost?.cached === undefined ? '#00BA7C' : '#A3A3A3'}
                    opacity={localPost?.cached === 'nexus' || localPost?.cached === undefined ? 1 : 0.2}
                  />
                </div>
              </div>
              {showTooltipPostChecked && !isMobile && <Tooltip.CheckedPost cached={localPost?.cached} />}
            </TooltipUI.Root>
          )}
        </div>
        <div className="flex-col inline-flex gap-0.5 overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-webkit">
          {localPost?.tags.map((tagObj, index) => {
            const displayedImages = tagObj?.taggers
              .slice(0, 4)
              .map((fromItem) => profileImages[fromItem])
              .filter(Boolean);

            const extraImagesCount = tagObj?.taggers_count - displayedImages.length;
            const taggers = tagObj.taggers;
            const hasAuthorTag = tagObj?.taggers.includes(localPost?.details?.author);

            return (
              <React.Fragment key={`${index}-${tagObj?.label}`}>
                <PostUI.Footer>
                  <div className="flex gap-2">
                    <PostUtil.Tag
                      id={`tag-${index}`}
                      clicked={hasAuthorTag}
                      color={tagObj?.label && Utils.generateRandomColor(tagObj?.label)}
                      onClick={() => {
                        if (loadingTags === tagObj?.label) return;
                        hasAuthorTag ? handleDeleteTag(tagObj?.label) : handleAddTag(tagObj?.label);
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tagObj?.label, 20)}
                        {loadingTags === tagObj?.label ? (
                          <Icon.LoadingSpin size="12" />
                        ) : (
                          <Typography.Caption id={`tag-${index}-count`} variant="bold" className="text-opacity-60">
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
                      <div key={imageIndex}>
                        <TooltipUI.Root
                          className="static"
                          delay={0}
                          setShowTooltip={() => setShowTooltipProfile(null)}
                          tagId={image}
                        >
                          <ImageByUri
                            id={taggers[imageIndex]}
                            width={32}
                            height={32}
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setShowTooltipProfile({ tagIndex: index, imageIndex });
                              setTooltipPosition({
                                top: rect.top - 10,
                                left: rect.left + rect.width / 2
                              });
                            }}
                            className={`cursor-pointer min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] rounded-full shadow justify-center items-center flex ${
                              imageIndex > 0 && '-ml-2'
                            }`}
                            alt={`tag-${imageIndex + 1}`}
                            uri={image}
                          />
                          {showTooltipProfile?.tagIndex === index &&
                            showTooltipProfile?.imageIndex === imageIndex &&
                            tooltipPosition && (
                              <TooltipUI.Main
                                ref={tooltipRef}
                                className="z-50 w-auto shadow-none px-0 pb-5 bg-transparent border-0 cursor-default fixed"
                                style={{
                                  top: `${tooltipPosition.top}px`,
                                  left: `${tooltipPosition.left}px`,
                                  transform: 'translateX(-50%)'
                                }}
                              >
                                <Tooltip.Profile profileId={taggers[imageIndex]} />
                              </TooltipUI.Main>
                            )}
                        </TooltipUI.Root>
                      </div>
                    ))}
                    {extraImagesCount > 0 && <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>}
                  </div>
                </PostUI.Footer>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex">
          <InputTagStandard
            handleAddTag={loadingTags === '' ? handleAddTag : () => {}}
            loadingTags={loadingTags !== ''}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTagInput={addTagInput}
            setAddTagInput={setAddTagInput}
          />
        </div>
      </div>
    </div>
  );
}

export default LargeView;
