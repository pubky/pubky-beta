'use client';

import { usePubkyClientContext } from '@/contexts';
import { PostType, PostView } from '@/types/Post';
import { Button, Icon, Post as PostUI, PostUtil, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import React from 'react';
import { useTagsLogic } from './TagsUtils';
import { PubkyAppPostKind } from 'pubky-app-specs';
import ShowAllTags from './_ShowAllTags';

interface TagsProps {
  post: PostView;
  postType: PostType;
}

export default function TagsLargeView({ post, postType }: TagsProps) {
  const isArticle = String(post?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase();
  const { isMobile } = useTagsLogic(post, postType);
  const { pubky } = usePubkyClientContext();

  return (
    <>
      <div className="relative flex items-center gap-0 mb-4">
        {isArticle ? (
          <div className="flex gap-3 items-center">
            <Icon.Tag size="14" color="gray" />
            <Typography.Label className="text-opacity-30">Tags Article</Typography.Label>
          </div>
        ) : (
          <PostUI.Time className="grow-0 justify-start">
            {Utils.timeAgo(post?.details?.indexed_at, isMobile)}
          </PostUI.Time>
        )}
        {post?.details?.author === pubky && !isArticle && (
          <div id="post-status" className="inline-flex items-center ml-2 top-[7px] relative">
            <Icon.Check size="20" color="#00BA7C" />
            <div
              id={
                post?.cached === 'nexus' || post?.cached === undefined ? 'post-status-indexed' : 'post-status-unindexed'
              }
              className="relative right-[10px]"
            >
              <Icon.Check
                size="20"
                color={post?.cached === 'nexus' || post?.cached === undefined ? '#00BA7C' : '#A3A3A3'}
                opacity={post?.cached === 'nexus' || post?.cached === undefined ? 1 : 0.2}
              />
            </div>
          </div>
        )}
      </div>
      <ShowAllTags post={post} postType={postType} />
    </>
  );
}
