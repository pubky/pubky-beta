'use client';

import React, { useEffect, useRef, useState } from 'react';

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
import Modal from '../Modal';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { ImageByUri } from '../ImageByUri';
import { PostTag, PostView } from '@/types/Post';
import { useAlertContext, usePubkyClientContext, useJoin } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/useIsMobile';
import Tooltip from '../Tooltip';

interface TagsLargeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
}

export default function TagsLargeView({ post }: TagsLargeViewProps) {
  const { pubky, timeline, setTimeline, createTag, deleteTag } =
    usePubkyClientContext();
  const isMobile = useIsMobile(1024);
  const { openJoin } = useJoin();
  const [tags, setTags] = useState<PostTag[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [tagInput, setTagInput] = useState('');
  const { addAlert } = useAlertContext();
  const [addTagInput, setAddTagInput] = useState<boolean>(false);
  const [showTooltipPostChecked, setShowTooltipPostChecked] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [profileImages, setProfileImages] = useState<{ [key: string]: string }>(
    {},
  );
  const [loadingTags, setLoadingTags] = useState('');
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post?.tags) {
      const sortedTags = post?.tags
        .slice()
        .sort((a, b) => b?.taggers_count - a?.taggers_count);
      setTags(sortedTags);
    }
  }, [post?.tags]);

  const handleDeleteTag = async (tag: string) => {
    setLoadingTags(tag);
    await deleteTag(post?.details?.author, post?.details?.id, tag);
    // delete my user from tag from post.tags
    const newTags = tags.map((tagObj) => {
      if (tagObj.label === tag) {
        return {
          ...tagObj,
          taggers_count: tagObj.taggers_count - 1,
          taggers: tagObj.taggers.filter((fromItem) => fromItem !== pubky),
          relationship: false,
        };
      }
      return tagObj;
    });
    setTags(newTags);
    setLoadingTags('');
  };

  const handleAddTag = async (tag: string) => {
    setLoadingTags(tag);
    await createTag(post?.details?.author, post?.details?.id, tag);
    // add tag to post.tags
    const newTags: PostTag[] = tags.map((tagObj) => {
      if (tagObj.label === tag) {
        return {
          ...tagObj,
          taggers_count: tagObj.taggers_count + 1,
          taggers: [...tagObj.taggers, pubky ?? ''],
          relationship: true,
        };
      }
      return tagObj;
    });
    setTags(newTags);
    setLoadingTags('');
  };

  useEffect(() => {
    const fetchProfileImages = async () => {
      const images: { [key: string]: string } = {};

      const taggerPromises = tags.flatMap((tagObj) =>
        tagObj?.taggers
          ?.map((fromItem) => {
            if (fromItem && !images[fromItem]) {
              return getUserProfile(fromItem, pubky ?? '')
                .then((profile) => {
                  images[fromItem] =
                    profile?.details?.image || '/images/webp/Userpic.webp';
                })
                .catch(() => {
                  images[fromItem] = '/images/webp/Userpic.webp';
                });
            }
            return null;
          })
          .filter(Boolean),
      );

      await Promise.all(taggerPromises);
      setProfileImages(images);
    };

    if (tags.length > 0) {
      fetchProfileImages();
    }
  }, [tags, pubky]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

  const updateTagsAndTimeline = (tag: string) => {
    let newTags: PostTag[] = tags;
    const existingTag = tags.find((tagObj) => tagObj.label === tag);

    if (existingTag) {
      if (!existingTag.taggers.includes(pubky ?? '')) {
        newTags = tags.map((tagObj) => {
          if (tagObj.label === tag) {
            return {
              ...tagObj,
              taggers_count: tagObj.taggers_count + 1,
              taggers: [...tagObj.taggers, pubky ?? ''],
              relationship: true,
            };
          }
          return tagObj;
        });
      }
    } else {
      newTags = [
        ...tags,
        {
          label: tag,
          taggers_count: 1,
          taggers: [pubky ?? ''],
          relationship: true,
        },
      ];
    }

    setTags(newTags);

    const newTimeline = timeline.map((timelinePost) => {
      if (timelinePost?.details?.id === post?.details?.id) {
        return { ...timelinePost, tags: newTags };
      }
      return timelinePost;
    });

    setTimeline(newTimeline);
  };

  const handleFastAddTag = async () => {
    setLoadingTags(tagInput);
    const response = await createTag(
      post?.details?.author,
      post?.details?.id,
      tagInput,
    );
    if (response) {
      updateTagsAndTimeline(tagInput);
      setAddTagInput(false);
      setTagInput('');
      setLoadingTags('');
    } else {
      addAlert('Something went wrong', 'warning');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFastAddTag();
    }
  };

  const handleChangeTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
    setTagInput(valueWithoutSpaces);
  };

  return (
    <div
      className="w-full lg:max-w-[250px] xl:max-w-[350px] mt-1.5 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div className={`flex-col inline-flex gap-2`}>
        <div className="relative flex items-center gap-0 mb-4">
          <PostUI.Time className="justify-start">
            {Utils.timeAgo(post?.details?.indexed_at, isMobile)}
          </PostUI.Time>
          {post?.details?.author === pubky && (
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
                    clicked={isTagFound}
                    color={
                      tagObj?.label && Utils.generateRandomColor(tagObj?.label)
                    }
                    onClick={() =>
                      pubky
                        ? isTagFound
                          ? handleDeleteTag(tagObj?.label)
                          : handleAddTag(tagObj?.label)
                        : openJoin()
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(tagObj?.label, 20)}
                      {loadingTags === tagObj?.label ? (
                        <Icon.LoadingSpin size="12" />
                      ) : (
                        <Typography.Caption
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
                      className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
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
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.TWITTER}
                    onEmojiClick={(emojiObject) => {
                      const emojiLength =
                        new Blob([emojiObject.emoji]).size / 2;

                      if (tagInput.length + emojiLength <= 20) {
                        setTagInput(tagInput + emojiObject.emoji);
                      }
                      setShowEmojis(false);
                    }}
                  />
                </div>
              )}
              <div className="w-fit">
                <Input.Text
                  placeholder="tag"
                  className="h-[32px] p-3 text-[14px] rounded-lg"
                  value={tagInput}
                  maxLength={20}
                  onChange={handleChangeTagInput}
                  onKeyDown={handleKeyDown}
                  disabled={loadingTags !== ''}
                  autoFocus
                  action={
                    <div className="flex gap-1 -mr-2">
                      <div
                        onClick={!loadingTags ? handleFastAddTag : undefined}
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
              onClick={() => (pubky ? setAddTagInput(true) : openJoin())}
              className={`cursor-pointer relative w-8 h-8 rounded-lg border border-white opacity-30 hover:opacity-50 border-dashed justify-center items-center gap-1 inline-flex`}
            >
              <div>
                <Icon.Plus size="16" />
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal.Tag
        post={post}
        tags={tags}
        updatePostInTimeline={(newTag: PostView) => {
          setLoadingTags(newTag?.details.content);
          setTags(newTag.tags);
          setLoadingTags('');
        }}
        handleAddTag={handleAddTag}
        handleDeleteTag={handleDeleteTag}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
    </div>
  );
}
