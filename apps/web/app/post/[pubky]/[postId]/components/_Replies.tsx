'use client';

import React from 'react';

import { Typography } from '@social/ui-shared';
import { Post } from '@/components';
import Skeletons from '@/components/Skeletons';

import { UseUserMuted } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';

import { PostView } from '@/types/Post';

export default function Replies({
  repliesResponse,
  isLoadingReplies,
  lastReplyRef,
}: {
  repliesResponse: { [key: string]: PostView } | undefined;
  post: PostView;
  isLoadingReplies: boolean;
  lastReplyRef: React.RefObject<HTMLDivElement>;
}) {
  const { pubky } = usePubkyClientContext();
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');
  const replies = repliesResponse ? Object.values(repliesResponse) : [];

  const renderReplies = (repliesArray: PostView[]) => {
    if (!Array.isArray(repliesArray)) {
      return null;
    }

    return repliesArray
      .filter((reply) => !mutedUsers?.includes(reply?.details?.author))
      .reverse()
      .map((reply, index) => {
        const isLastReply = index === 0;
        return (
          <div
            className="flex flex-col gap-3"
            key={reply?.details?.id}
            ref={isLastReply ? lastReplyRef : null}
          >
            <Post post={reply} size="full" />
          </div>
        );
      });
  };

  return (
    <>
      {isLoadingReplies ? (
        <Skeletons.Simple />
      ) : !Array.isArray(replies) ? (
        <Typography.Body className="text-opacity-50 text-center mt-[100px]">
          No replies yet
        </Typography.Body>
      ) : (
        <div className="flex-col gap-3 inline-flex w-full mt-3">
          {renderReplies(replies)}
        </div>
      )}
    </>
  );
}
