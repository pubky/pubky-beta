'use client';

import { useState, useEffect } from 'react';

import { usePubkyClientContext } from '@/contexts/_pubky';
import { useAlertContext, useModal } from '@/contexts';

import { PostView } from '@/types/Post';

import { useIsMobile } from '@/hooks/useIsMobile';
import { Utils as TagsUtils } from '@/components/SinglePost/Tags/utils';
import { Icon, Post, PostUtil, Tooltip as TooltipUI, Typography } from '@social/ui-shared';
import { Tooltip } from '@/components';
import { Utils } from '@social/utils-shared';
import InputTagStandard from './components/_InputTagStandard';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
}

export function PostStandard({ post, largeView = false }: PostProps) {
  const { pubky, createTag, deleteTag } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { openModal } = useModal();

  const isMobile = useIsMobile();
  const [showTooltipTag, setShowTooltipTag] = useState<string | null>(null);
  const [localPost, setLocalPost] = useState(post);
  const [loadingTags, setLoadingTags] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [addTagInput, setAddTagInput] = useState(false);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

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
      setLoadingTags
    );
  };

  const handleDeleteTag = async (tag: string) => {
    await TagsUtils.TagsCommonFunctions.handleDeleteTag(
      tag,
      localPost,
      deleteTag,
      setLocalPost,
      addAlert,
      setLoadingTags
    );
  };

  return (
    <div className="lg:mt-3 cursor-default" onClick={(event) => event.stopPropagation()}>
      {!(isMobile && localPost.tags.length === 0) && (
        <div id="tags" className="gap-2 flex-row inline-flex items-center flex-wrap mt-2 lg:mt-0">
          <>
            {!largeView &&
              localPost.tags.slice(0, 3).map((tagObj, index) => {
                const isTagFound = tagObj?.taggers?.includes(localPost.details.author) || false;

                return (
                  <Post.Footer key={index}>
                    <TooltipUI.Root delay={0} setShowTooltip={setShowTooltipTag} tagId={tagObj?.label}>
                      {showTooltipTag === tagObj?.label && <Tooltip.Tag2 tags={tagObj} />}
                      {tagObj && (
                        <PostUtil.Tag
                          id={`tag-${index}`}
                          clicked={isTagFound}
                          color={tagObj?.label && Utils.generateRandomColor(tagObj?.label)}
                          onClick={() =>
                            pubky
                              ? isTagFound
                                ? handleDeleteTag(tagObj?.label)
                                : handleAddTag(tagObj?.label)
                              : openModal('join')
                          }
                        >
                          <div id={`tag-${index}-count`} className="flex gap-2 items-center">
                            {Utils.minifyText(tagObj?.label, 20)}
                            {loadingTags === tagObj?.label ? (
                              <Icon.LoadingSpin size="12" />
                            ) : (
                              <Typography.Caption variant="bold" className="text-opacity-60">
                                {tagObj?.taggers_count}
                              </Typography.Caption>
                            )}
                          </div>
                        </PostUtil.Tag>
                      )}
                    </TooltipUI.Root>
                  </Post.Footer>
                );
              })}
          </>
          {!largeView && (
            <div className="hidden md:flex">
              <InputTagStandard
                tagInput={tagInput}
                setTagInput={setTagInput}
                loadingTags={loadingTags}
                handleAddTag={handleAddTag}
                addTagInput={addTagInput}
                setAddTagInput={setAddTagInput}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostStandard;
