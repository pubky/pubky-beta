'use client';

import React, { useState } from 'react';
import {
  Button,
  Icon,
  Input,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '@/components/ImageByUri';
import { PostView } from '@/types/Post';
import Link from 'next/link';
import EmojiPicker from '@/components/EmojiPicker';
import { useTagsLogic } from './components/TagsUtils';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { usePubkyClientContext } from '@/contexts';
import Tooltip from '@/components/Tooltip';

interface TagsLargeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
}

export default function LargeView({ post }: TagsLargeViewProps) {
  const {
    tags,
    tagInput,
    setTagInput,
    showEmojis,
    profileImages,
    setShowEmojis,
    loadingTags,
    handleAddTag,
    handleDeleteTag,
    handleInputChange,
    handleKeyDown,
    wrapperRefEmojis,
    openModal,
    isMobile,
    addTagInput,
    setAddTagInput,
  } = useTagsLogic(post);
  const { pubky } = usePubkyClientContext();
  const [showTooltipPostChecked, setShowTooltipPostChecked] = useState('');
  const isArticle =
    String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase();

  return (
    <div
      className="mt-1.5 w-auto cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div className={`min-w-[380px] flex-col inline-flex gap-2`}>
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
        <div className="flex">
          {addTagInput ? (
            <>
              {showEmojis && (
                <div
                  className="absolute translate-y-[10%] translate-x-[0%] z-10"
                  ref={wrapperRefEmojis}
                >
                  <EmojiPicker
                    onEmojiSelect={(emojiObject) => {
                      setTagInput(tagInput + emojiObject.native);
                      setShowEmojis(false);
                    }}
                    maxLength={20}
                    currentInput={tagInput}
                  />
                </div>
              )}
              <div className="w-fit">
                <Input.Text
                  id="add-tag-input"
                  placeholder="tag"
                  className="h-[32px] p-3 text-[14px] rounded-lg"
                  value={tagInput}
                  maxLength={20}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={loadingTags !== ''}
                  autoFocus
                  action={
                    <div className="flex gap-1 -mr-2">
                      <div
                        id="add-tag-btn"
                        onClick={
                          !loadingTags
                            ? () => handleAddTag(tagInput)
                            : undefined
                        }
                        className={`${tagInput ? 'flex' : 'hidden'} cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100`}
                      >
                        {loadingTags ? (
                          <Icon.LoadingSpin size="12" />
                        ) : (
                          <Icon.Plus size="12" />
                        )}
                      </div>
                      <div className="flex">
                        <div
                          onClick={() => setShowEmojis(true)}
                          className="hidden mr-1 lg:flex cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100"
                        >
                          <Icon.Smiley size="12" />
                        </div>
                        <div
                          onClick={() => setAddTagInput(false)}
                          className="cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100"
                        >
                          <Icon.X size="12" />
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            </>
          ) : (
            <div
              id="show-add-tag-input-btn"
              onClick={() => (pubky ? setAddTagInput(true) : openModal('join'))}
              className={`cursor-pointer relative w-8 h-8 rounded-lg border border-white opacity-30 hover:opacity-50 border-dashed justify-center items-center gap-1 inline-flex`}
            >
              <div>
                <Icon.Plus size="16" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
