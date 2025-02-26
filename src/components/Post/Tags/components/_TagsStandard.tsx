'use client';

import Tooltip from '@/components/Tooltip';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { Icon, Post, PostUtil, Tooltip as TooltipUI, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';
import { useTagsLogic } from './TagsUtils';

interface TagsProps {
  post: PostView;
  largeView: boolean;
}

export default function TagsStandard({ post, largeView }: TagsProps) {
  const [showTooltipTag, setShowTooltipTag] = useState<string | null>(null);
  const { tags, loadingTags, handleAddTag, handleDeleteTag, openModal } = useTagsLogic(post);

  const { pubky } = usePubkyClientContext();

  return (
    <>
      {!largeView &&
        tags.slice(0, 3).map((tagObj, index) => {
          const isTagFound = tagObj?.relationship || false;

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
  );
}
