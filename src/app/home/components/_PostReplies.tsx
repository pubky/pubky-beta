'use client';

import { Typography, Icon } from '@social/ui-shared';
import * as Components from '@/components';
import { usePubkyClientContext, useModal } from '@/contexts';
import { usePostReplies } from '@/hooks/usePost';
import { Utils } from '@social/utils-shared';
import CreateQuickReply from '@/components/CreateQuickReply';
import Link from 'next/link';
import { PostView } from '@/types/Post';

interface PostRepliesProps {
  post: PostView;
  layout: string;
  homeView?: boolean;
  isMobile: boolean;
}

export const PostReplies = ({ post, layout, homeView = false, isMobile }: PostRepliesProps) => {
  const { pubky, mutedUsers, deletedPosts } = usePubkyClientContext();
  const { openModal } = useModal();
  const { data: replies } = usePostReplies(
    post.details.author,
    post.details.id,
    pubky,
    0,
    2,
    undefined,
    undefined,
    'ascending'
  );

  const lineBaseCSS = `ml-[12px] absolute border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS = (
    <div className="absolute ml-[10px]">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );
  const lineBaseCSS2 = `ml-[11px] absolute border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[62px] after:block after:mt-[-38px] after:-ml-[1px]`;
  const lineHorizontalCSS2 = (
    <div className="absolute ml-[10px] mt-[22px]">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );

  if (!replies || replies.length === 0) return null;

  const filteredReplies = replies.filter(
    (reply) => !mutedUsers?.includes(reply?.details?.author) && !deletedPosts?.includes(reply?.details?.id)
  );

  const displayedReplies = filteredReplies.slice(0, 2);

  const mutedRepliesCount = replies.filter((reply) => mutedUsers?.includes(reply?.details?.author)).length;

  const repliesLeft = post?.counts?.replies - displayedReplies.length - mutedRepliesCount;

  const showQuickReply = displayedReplies.length > 0;

  return (
    <>
      {showQuickReply && (
        <div id="replies-container" className="mt-3 flex flex-col gap-3">
          {displayedReplies.map((reply) => (
            <Components.Post
              key={reply.details.id}
              post={reply}
              largeView={!isMobile && layout === 'wide'}
              line={Boolean(reply?.relationships?.replied)}
              homeView={homeView}
              postType="replies"
            />
          ))}
          {repliesLeft > 0 && (
            <div>
              <div className={lineBaseCSS} />
              {lineHorizontalCSS}
              <div onClick={() => openModal('postView', { post })}>
                <Typography.Body
                  variant="small-bold"
                  className="cursor-pointer flex gap-1 items-center ml-8 hover:opacity-80"
                >
                  <Icon.PlusCircle />
                  {repliesLeft === 1 ? '1 more reply' : `${repliesLeft} more replies`}
                </Typography.Body>
              </div>
            </div>
          )}
          {post?.details?.content !== '[DELETED]' && (
            <div className="relative">
              <div className={lineBaseCSS2} />
              {lineHorizontalCSS2}
              <CreateQuickReply post={post} />
            </div>
          )}
        </div>
      )}
    </>
  );
};
