'use client';

import { Typography, Icon } from '@social/ui-shared';
import * as Components from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { usePostReplies } from '@/hooks/usePost';
import { UseUserMuted } from '@/hooks/useUser';
import { Utils } from '@social/utils-shared';
import CreateQuickReply from '@/components/CreateQuickReply';
import Link from 'next/link';

interface PostRepliesProps {
  post: any; // Define proper type
  layout: string;
  homeView?: boolean;
  isMobile: boolean;
}

export const PostReplies = ({
  post,
  layout,
  homeView = false,
  isMobile,
}: PostRepliesProps) => {
  const { pubky } = usePubkyClientContext();
  const { data: replies } = usePostReplies(
    post.details.author,
    post.details.id
  );
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');

  const lineBaseCSS = `ml-[12px] absolute border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[2px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS = (
    <div className="absolute ml-[10px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );
  const lineBaseCSS2 = `ml-[11px] absolute border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[1.6px] after:h-[62px] after:block after:-mt-[38px] after:-ml-[1px]`;
  const lineHorizontalCSS2 = (
    <div className="absolute ml-[10px] mt-[22px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );

  if (!replies || replies.length === 0) return null;

  const displayedReplies = replies.slice(0, 2);
  const repliesLeft = post?.counts?.replies - displayedReplies.length;

  return (
    <div className="mt-3 flex flex-col gap-3">
      {displayedReplies
        .filter((post) => !mutedUsers?.includes(post?.details?.author))
        .reverse()
        .map((reply) => (
          <Components.Post
            key={reply.details.id}
            post={reply}
            largeView={!isMobile && layout === 'wide'}
            line={Boolean(reply?.relationships?.replied)}
            homeView={homeView}
          />
        ))}
      {repliesLeft > 0 && (
        <div>
          <div className={lineBaseCSS} />
          {lineHorizontalCSS}
          <Link href={Utils.encodePostUri(post?.details?.uri)}>
            <Typography.Body
              variant="small-bold"
              className="cursor-pointer flex gap-1 items-center ml-8 hover:opacity-80"
            >
              <Icon.PlusCircle />
              {repliesLeft === 1
                ? '1 more reply'
                : `${repliesLeft} more replies`}
            </Typography.Body>
          </Link>
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
  );
};
