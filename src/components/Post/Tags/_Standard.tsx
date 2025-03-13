import { useState, useEffect } from 'react';

import { usePubkyClientContext } from '@/contexts/_pubky';
import { useAlertContext, useModal } from '@/contexts';

import { PostView } from '@/types/Post';

import { useIsMobile } from '@/hooks/useIsMobile';
import { InputTagStandard } from './components';
import { Icon, Post, PostUtil, Tooltip as TooltipUI, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Tooltip from '@/components/Tooltip';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostView;
  largeView?: boolean;
}

export function Standard({ post, largeView = false }: PostProps) {
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
    if (!tag) return;

    // check if the tag already exists in the localPost.tags array, and the author is not the author of the post, and the count is greater than 0
    const tagExists = localPost.tags.some(
      (t) => t.label === tag && t.taggers.includes(localPost.details.author) && t.taggers_count > 0
    );
    if (tagExists) {
      addAlert('Tag already exists', 'warning');
      return;
    }

    setLoadingTags(tag);
    const response = await createTag(localPost.details.author, localPost.details.id, tag);
    if (response) {
      // check if the tag already exists in the localPost.tags array
      const tagExists = localPost.tags.some((t) => t.label === tag);
      if (tagExists) {
        const updatedTags = localPost.tags.map((t) =>
          t.label === tag
            ? { ...t, taggers: [...t.taggers, localPost.details.author], taggers_count: t.taggers_count + 1 }
            : t
        );
        setLocalPost({ ...localPost, tags: updatedTags });
      } else {
        const updatedTags = [...localPost.tags, { label: tag, taggers: [localPost.details.author], taggers_count: 1 }];
        setLocalPost({ ...localPost, tags: updatedTags });
      }
      if (tag === tagInput) {
        setTagInput('');
        setAddTagInput(false);
      }
    } else {
      addAlert('Something went wrong', 'warning');
    }
    setLoadingTags('');
  };

  const handleDeleteTag = async (tag: string) => {
    setLoadingTags(tag);
    const response = await deleteTag(localPost.details.author, localPost.details.id, tag);
    if (response) {
      // check if pubky already is a tagger of the tag
      const tagExists = localPost.tags.some((t) => t.taggers.includes(localPost.details.author));
      if (tagExists) {
        const updatedTags = localPost.tags.map((t) =>
          t.label === tag
            ? {
                ...t,
                taggers: t.taggers.filter((tagger) => tagger !== localPost.details.author),
                taggers_count: t.taggers_count - 1
              }
            : t
        );
        setLocalPost({ ...localPost, tags: updatedTags });
      } else {
        const updatedTags = localPost.tags.filter((t) => t.label !== tag);
        setLocalPost({ ...localPost, tags: updatedTags });
      }
    } else {
      addAlert('Something went wrong', 'warning');
    }
    setLoadingTags('');
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
                post={post}
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

export default Standard;
