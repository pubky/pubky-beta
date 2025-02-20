'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Icon,
  Input,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Tooltip from '../Tooltip';
import Modal from '../Modal';
import { PostTag, PostView } from '@/types/Post';
import { useAlertContext, usePubkyClientContext, useJoin } from '@/contexts';
import { useIsMobile } from '@/hooks/useIsMobile';
import { BottomSheet } from '../BottomSheet';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  showSheetTag: boolean;
  setShowSheetTag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Tags({
  post,
  largeView = false,
  showModalTag,
  setShowModalTag,
  showSheetTag,
  setShowSheetTag,
}: PostProps) {
  const [showTooltipTag, setShowTooltipTag] = useState('');
  const { pubky, setTimeline, createTag, deleteTag } = usePubkyClientContext();
  const isMobile = useIsMobile(768);
  const { openJoin } = useJoin();
  const [tags, setTags] = useState<PostTag[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { addAlert } = useAlertContext();
  const [addTagInput, setAddTagInput] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [loadingTags, setLoadingTags] = useState('');
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post?.tags) {
      setTags(post.tags);
    }
  }, [post?.tags]);

  const handleDeleteTag = async (tag: string) => {
    setLoadingTags(tag);
    await deleteTag(post.details.author, post.details.id, tag);
    updateTagsAndTimeline(tag, false);
    setLoadingTags('');
  };

  const updateTagsAndTimeline = (tag: string, isAdding: boolean) => {
    let newTags: PostTag[] = tags;
    const existingTag = tags.find((tagObj) => tagObj.label === tag);
    let uniqueTagsChange = 0;

    if (isAdding) {
      if (!existingTag) {
        newTags = [
          ...tags,
          {
            label: tag,
            taggers_count: 1,
            taggers: [pubky ?? ''],
            relationship: true,
          },
        ];
        uniqueTagsChange = 1;
      } else if (!existingTag.taggers.includes(pubky ?? '')) {
        newTags = tags.map((tagObj) =>
          tagObj.label === tag
            ? {
                ...tagObj,
                taggers_count: tagObj.taggers_count + 1,
                taggers: [...tagObj.taggers, pubky ?? ''],
                relationship: true,
              }
            : tagObj,
        );

        if (existingTag.taggers_count === 0) {
          uniqueTagsChange = 1;
        }
      }
    } else {
      newTags = tags.map((tagObj) => {
        if (tagObj.label === tag) {
          if (tagObj.taggers_count === 1) {
            uniqueTagsChange = -1;
            return {
              ...tagObj,
              taggers_count: 0,
              taggers: [],
              relationship: false,
            };
          }
          return {
            ...tagObj,
            taggers_count: tagObj.taggers_count - 1,
            taggers: tagObj.taggers.filter((t) => t !== pubky),
            relationship: false,
          };
        }
        return tagObj;
      });
    }

    setTags(newTags);

    setTimeline((prevTimeline) =>
      prevTimeline.map((timelinePost) => {
        if (timelinePost.details.id === post.details.id) {
          return {
            ...timelinePost,
            tags: newTags,
            counts: {
              ...timelinePost.counts,
              unique_tags: Math.max(
                0,
                timelinePost.counts.unique_tags + uniqueTagsChange,
              ),
            },
          };
        }
        return timelinePost;
      }),
    );
  };

  const handleAddTag = async (tag: string) => {
    setLoadingTags(tag);
    await createTag(post.details.author, post.details.id, tag);
    updateTagsAndTimeline(tag, true);
    setLoadingTags('');
  };

  const handleFastAddTag = async () => {
    setLoadingTags(tagInput);
    const response = await createTag(
      post?.details?.author,
      post?.details?.id,
      tagInput,
    );
    if (response) {
      updateTagsAndTimeline(tagInput, true);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
    setTagInput(valueWithoutSpaces);
  };

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

  return (
    <div
      className="lg:mt-3 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      {isMobile && tags.length === 0 ? (
        ''
      ) : (
        <div
          id="tags"
          className="gap-2 flex-row inline-flex items-center flex-wrap mt-2 lg:mt-0"
        >
          {!largeView &&
            tags.slice(0, 3).map((tagObj, index) => {
              const isTagFound = tagObj?.relationship || false;

              return (
                <PostUI.Footer key={index}>
                  <TooltipUI.Root
                    delay={0}
                    setShowTooltip={setShowTooltipTag}
                    tagId={tagObj?.label}
                  >
                    {showTooltipTag === tagObj?.label && (
                      <Tooltip.Tag2 tags={tagObj} />
                    )}
                    {tagObj && (
                      <PostUtil.Tag
                        id={`tag-${index}`}
                        clicked={isTagFound}
                        color={
                          tagObj?.label &&
                          Utils.generateRandomColor(tagObj?.label)
                        }
                        onClick={() =>
                          pubky
                            ? isTagFound
                              ? handleDeleteTag(tagObj?.label)
                              : handleAddTag(tagObj?.label)
                            : openJoin()
                        }
                      >
                        <div
                          id={`tag-${index}-count`}
                          className="flex gap-2 items-center"
                        >
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
                    )}
                  </TooltipUI.Root>
                </PostUI.Footer>
              );
            })}
          {!largeView && (
            <div className="hidden md:flex">
              {addTagInput ? (
                <>
                  {showEmojis && (
                    <div
                      className="absolute translate-y-[10%] translate-x-[30%] z-10"
                      ref={wrapperRefEmojis}
                    >
                      <Picker
                        theme="dark"
                        data={data}
                        onEmojiSelect={(emojiObject) => {
                          const emojiLength =
                            new Blob([emojiObject.native]).size / 2;

                          if (tagInput.length + emojiLength <= 20) {
                            setTagInput(tagInput + emojiObject.native);
                          }
                          setShowEmojis(false);
                        }}
                      />
                    </div>
                  )}

                  <Input.Text
                    placeholder="tag"
                    className="h-[32px] p-3 text-[14px] rounded-lg"
                    value={tagInput}
                    maxLength={20}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    disabled={loadingTags !== ''}
                    action={
                      <div className="flex gap-1 -mr-2">
                        <div
                          id="add-tag-btn"
                          onClick={!loadingTags ? handleFastAddTag : undefined}
                          className={`${tagInput ? 'flex' : 'hidden'} cursor-pointer p-1 rounded-full bg-white bg-opacity-10 ${loadingTags ? 'opacity-50' : 'opacity-80 hover:opacity-100'}`}
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
                            id="close-add-tag-input-btn"
                            onClick={() => setAddTagInput(false)}
                            className="cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100"
                          >
                            <Icon.X size="12" />
                          </div>
                        </div>
                      </div>
                    }
                  />
                </>
              ) : (
                <div
                  id="show-add-tag-input-btn"
                  onClick={() => (pubky ? setAddTagInput(true) : openJoin())}
                  className={`cursor-pointer relative w-8 h-8 rounded-lg border border-white opacity-30 hover:opacity-50 border-dashed justify-center items-center gap-1 inline-flex`}
                >
                  <div>
                    <Icon.Plus size="16" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <Modal.Tag
        post={post}
        tags={tags}
        handleAddTag={handleAddTag}
        handleDeleteTag={handleDeleteTag}
        showModalTag={showModalTag}
        setShowModalTag={setShowModalTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      <BottomSheet.Tag
        post={post}
        tags={tags}
        handleAddTag={handleAddTag}
        handleDeleteTag={handleDeleteTag}
        show={showSheetTag}
        setShow={setShowSheetTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
    </div>
  );
}
