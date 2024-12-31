'use client';

import { useEffect, useState } from 'react';

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
import { useAlertContext, usePubkyClientContext } from '@/contexts';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Tags({
  post,
  largeView = false,
  showModalTag,
  setShowModalTag,
}: PostProps) {
  const [showTooltipTag, setShowTooltipTag] = useState('');
  const { pubky, createTag, deleteTag } = usePubkyClientContext();
  const [tags, setTags] = useState<PostTag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const { addAlert } = useAlertContext();
  const [addTagInput, setAddTagInput] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [loadingTags, setLoadingTags] = useState('');

  useEffect(() => {
    if (post?.tags) {
      const sortedTags = post?.tags
        .slice()
        .sort((a, b) => b.taggers_count - a.taggers_count);
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
        };
      }
      return tagObj;
    });
    setTags(newTags);
    setLoadingTags('');
  };

  const handleFastAddTag = async () => {
    await createTag(post?.details?.author, post?.details?.id, tagInput);
    setAddTagInput(false);
    setTagInput('');
    addAlert('Tag added!');
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

  return (
    <div
      className="lg:mt-6 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        id="tags"
        className={`flex-row inline-flex gap-2 flex-wrap mt-6 lg:mt-0`}
      >
        {!largeView &&
          tags.slice(0, 3).map((tagObj, index) => {
            const isTagFound = tagObj?.taggers?.some(
              (fromItem) => fromItem === pubky,
            );
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
                  {tagObj.taggers_count > 0 && (
                    <PostUtil.Tag
                      id={`tag-${index}`}
                      clicked={isTagFound}
                      color={
                        tagObj?.label &&
                        Utils.generateRandomColor(tagObj?.label)
                      }
                      onClick={() =>
                        isTagFound
                          ? handleDeleteTag(tagObj?.label)
                          : handleAddTag(tagObj?.label)
                      }
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(tagObj?.label, 13)}
                        {loadingTags === tagObj?.label ? (
                          <Icon.LoadingSpin size="16" />
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
        {tags.length < 3 && !largeView && (
          <div className="hidden md:flex">
            {addTagInput ? (
              <Input.Text
                placeholder="tag"
                className="h-[32px] p-3 text-[14px] rounded-lg"
                value={tagInput}
                maxLength={20}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
                action={
                  <div className="flex gap-1 -mr-2">
                    <div
                      onClick={handleFastAddTag}
                      className={`${tagInput ? 'flex' : 'hidden'} cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100`}
                    >
                      <Icon.Plus size="12" />
                    </div>
                    <div
                      onClick={() => setAddTagInput(false)}
                      className="cursor-pointer p-1 rounded-full bg-white bg-opacity-10 opacity-80 hover:opacity-100"
                    >
                      <Icon.X size="12" />
                    </div>
                  </div>
                }
              />
            ) : (
              <div
                onClick={() => setAddTagInput(true)}
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
