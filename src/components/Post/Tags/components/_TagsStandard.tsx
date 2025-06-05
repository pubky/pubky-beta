'use client';

import Tooltip from '@/components/Tooltip';
import { usePubkyClientContext } from '@/contexts';
import { PostType, PostView } from '@/types/Post';
import { Button, Icon, PostUtil, Tooltip as TooltipUI, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';
import { useTagsLogic } from './TagsUtils';
import ShowAllTags from './_ShowAllTags';
import { useIsMobile } from '@/hooks/useIsMobile';

interface TagsProps {
  post: PostView;
  largeView: boolean;
  postType: PostType;
  showTags: boolean;
}

export default function TagsStandard({ post, largeView, postType, showTags }: TagsProps) {
  const isMobile = useIsMobile(1024);
  const [showTooltipTag, setShowTooltipTag] = useState<string | null>(null);
  const { tags, loadingTags, handleAddTag, handleDeleteTag, openModal } = useTagsLogic(post, postType);
  const { pubky } = usePubkyClientContext();

  const renderTag = (tagObj: (typeof tags)[0], index: number) => {
    const isTagFound = tagObj?.relationship || false;

    return (
      <div className="flex gap-2" key={index}>
        <TooltipUI.Root delay={0} setShowTooltip={setShowTooltipTag} tagId={tagObj?.label}>
          {showTooltipTag === tagObj?.label && !isMobile && <Tooltip.Tag2 tags={tagObj} />}
          {tagObj && (
            <PostUtil.Tag
              id={`tag-${index}`}
              clicked={isTagFound}
              color={tagObj?.label && Utils.generateRandomColor(tagObj?.label)}
              onClick={() =>
                pubky ? (isTagFound ? handleDeleteTag(tagObj?.label) : handleAddTag(tagObj?.label)) : openModal('join')
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
      </div>
    );
  };

  return (
    <>
      {!largeView && (
        <>
          {showTags ? (
            <ShowAllTags post={post} postType={postType} />
          ) : (
            tags.slice(0, 3).map((tagObj, index) => renderTag(tagObj, index))
          )}
        </>
      )}
    </>
  );
}
