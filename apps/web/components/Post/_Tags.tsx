'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Icon,
  Post as PostUI,
  PostUtil,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Tooltip from '../Tooltip';
import Modal from '../Modal';
import { PostTag, PostView } from '@/types/Post';
import { usePubkyClientContext } from '@/contexts';

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

  return (
    <div
      className="lg:mt-6 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        id="tags"
        className={`flex-row inline-flex gap-2 flex-wrap mt-6 lg:mt-0`}
      >
        <div className="hidden md:flex">
          <Button.Action
            id="tag-btn"
            size="small"
            variant="custom"
            icon={<Icon.Tag size="16" />}
            counter={post?.tags?.length}
            onClick={() => {
              setShowModalTag(true);
            }}
          />
        </div>
        {!largeView &&
          tags.slice(0, 3).map((tagObj, index) => {
            const isTagFound = tagObj?.taggers?.some(
              (fromItem) => fromItem === pubky
            );
            return (
              <PostUI.Footer key={index}>
                <TooltipUI.Root
                  delay={0}
                  setShowTooltip={setShowTooltipTag}
                  tagId={tagObj?.label}
                >
                  {showTooltipTag === tagObj?.label && (
                    <Tooltip.Tag2
                      setSelectedTag={setSelectedTag}
                      setShowModalTags={setShowModalTag}
                      tags={tagObj}
                    />
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
                        {Utils.minifyText(tagObj?.label.replace(' ', ''), 13)}
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
