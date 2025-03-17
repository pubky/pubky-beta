'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PubkyAppPostKind } from 'pubky-app-specs';

import { usePubkyClientContext, useAlertContext } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getUserProfile } from '@/services/userService';

import { PostView } from '@/types/Post';

import {
  Button,
  Icon,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
  Modal as ModalUI,
  Input
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri, Tooltip } from '@/components';
import { Utils as TagsUtils } from '@/components/SinglePost/Tags/utils';
import SinglePost from '@/components/SinglePost';
import EmojiPicker from '@/components/EmojiPicker';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  tagsError?: boolean;
}

export function PostModal({ showModal, setShowModal, post, tagsError }: TagProps) {
  const { pubky } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { createTag, deleteTag } = usePubkyClientContext();

  const tooltipRef = useRef(null);
  const isMobile = useIsMobile();
  const wrapperRefEmojis = useRef(null);

  const [localPost, setLocalPost] = useState(post);
  const [showTooltipPostChecked, setShowTooltipPostChecked] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [showTooltipProfile, setShowTooltipProfile] = useState<{ tagIndex: number; imageIndex: number } | null>(null);
  const [loadingTags, setLoadingTags] = useState('');
  const [profileImages, setProfileImages] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [addTagInput, setAddTagInput] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

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

  const handleDeleteTag = async (tag: string) => {
    await TagsUtils.TagsCommonFunctions.handleDeleteTag(
      tag,
      localPost,
      deleteTag,
      setLocalPost,
      addAlert,
      setLoadingTags,
      pubky
    );
  };

  const handleAddTag = async (tag: string) => {
    await TagsUtils.TagsCommonFunctions.handleAddTag(
      tag,
      localPost,
      createTag,
      setLocalPost,
      addAlert,
      tagInput,
      setTagInput,
      setAddTagInput,
      setLoadingTags,
      pubky
    );
  };

  useEffect(() => {
    if (localPost?.tags.length > 0) fetchProfileImages();
  }, [localPost?.tags]);

  // Early return if no post
  if (!post) {
    return null;
  }

  // Render tag input editor section
  const renderTagEditor = () => (
    <div>
      {showEmojis && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-[9998]" onClick={() => setShowEmojis(false)} />
          <div
            id="emoji-picker"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg"
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
        </>
      )}
      <Input.Label value="New tag" />
      <div className="w-full md:w-[500px] mt-2">
        <Input.Tag
          value={tagInput}
          onChange={setTagInput}
          onAddTag={handleAddTag}
          onEmojiPickerClick={() => setShowEmojis(true)}
          loading={loadingTags !== ''}
          autoFocus
          variant="default"
          className="w-full"
        />
      </div>
      <div className="mt-4 w-full md:w-[500px] hidden md:flex">
        <SinglePost post={post} repostView />
      </div>
      {tagsError && (
        <Typography.Body variant="small" className="text-[#e95164] mt-4">
          Max 4 tags
        </Typography.Body>
      )}
    </div>
  );

  // Render tags display section
  const renderTagsDisplay = () => (
    <div
      id="current-tags"
      className="justify-start items-start gap-2 flex flex-col overflow-y-auto min-w-[200px] max-h-[300px] scrollbar-thin scrollbar-webkit"
    >
      <Input.Label value="Current tags" />
      {localPost?.tags?.length > 0 ? (
        <>
          {localPost.tags.map((tagObj, index) => {
            const displayedImages = tagObj?.taggers
              .slice(0, 4)
              .map((fromItem) => profileImages[fromItem])
              .filter(Boolean);

            const extraImagesCount = tagObj?.taggers_count - displayedImages.length;
            const taggers = tagObj.taggers;
            const isTagFound = tagObj?.taggers?.includes(pubky) || false;

            return (
              <div className="flex gap-2" key={index}>
                <PostUtil.Tag
                  id={`tag-${index}`}
                  clicked={isTagFound}
                  color={tagObj?.label && Utils.generateRandomColor(tagObj?.label)}
                  onClick={() => {
                    if (loadingTags === tagObj?.label) return;
                    isTagFound ? handleDeleteTag(tagObj.label) : handleAddTag(tagObj.label);
                  }}
                >
                  <div className="flex gap-2 items-center">
                    {Utils.minifyText(tagObj?.label, 21)}
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
              </div>
            );
          })}
        </>
      ) : (
        <Typography.Body variant="small" className="text-opacity-30">
          No tags yet.
        </Typography.Body>
      )}
    </div>
  );

  return (
    <ModalUI.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="w-full md:max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <ModalUI.CloseAction id="close-btn" onClick={() => setShowModal(false)} />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <ModalUI.Header title="Tag Post" />
        <ModalUI.Content className="flex flex-row w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {renderTagEditor()}
            {renderTagsDisplay()}
          </div>
        </ModalUI.Content>
      </div>
    </ModalUI.Root>
  );
}

export default PostModal;
