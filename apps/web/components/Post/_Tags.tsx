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
}

export default function Tags({ post, largeView = false }: PostProps) {
  const [showTooltipTag, setShowTooltipTag] = useState('');
  const { pubky, createTag, deleteTag } = usePubkyClientContext();
  const [tags, setTags] = useState<PostTag[]>([]);
  const [showModalTag, setShowModalTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    if (post?.tags) {
      const sortedTags = post?.tags
        .slice()
        .sort((a, b) => b.taggers_count - a.taggers_count);
      setTags(sortedTags);
    }
  }, [post?.tags]);

  const handleDeleteTag = async (tag: string) => {
    setLoadingTags(true);
    await deleteTag(post?.details?.id, tag);
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
    setLoadingTags(false);
  };

  const handleAddTag = async (tag: string) => {
    setLoadingTags(true);
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
    setLoadingTags(false);
  };

  return (
    <div
      className="mt-6 cursor-default"
      onClick={(event) => event.stopPropagation()}
    >
      <div id="tags" className={`flex-row inline-flex gap-2 mt-6 lg:mt-0`}>
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
        {!largeView &&
          tags.map((tagObj, index) => {
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
                  <PostUtil.Tag
                    id={`tag-${index}`}
                    clicked={isTagFound}
                    color={
                      tagObj?.label && Utils.generateRandomColor(tagObj?.label)
                    }
                    onClick={() =>
                      isTagFound
                        ? handleDeleteTag(tagObj?.label)
                        : handleAddTag(tagObj?.label)
                    }
                  >
                    <div className="flex gap-2 items-center">
                      {Utils.minifyText(tagObj?.label.replace(' ', ''), 14)}
                      {loadingTags ? (
                        <Icon.LoadingSpin size="16" />
                      ) : (
                        <Typography.Caption
                          variant="bold"
                          className="text-opacity-30"
                        >
                          {tagObj?.taggers_count}
                        </Typography.Caption>
                      )}
                    </div>
                  </PostUtil.Tag>
                </TooltipUI.Root>
              </PostUI.Footer>
            );
          })}
      </div>
      <Modal.Tag
        post={post}
        tags={tags}
        updatePostInTimeline={(newTag: PostView) => {
          setLoadingTags(true);
          setTags(newTag.tags);
          setLoadingTags(false);
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
