import { Post } from '@/components';
import CreateQuickReply from '@/components/CreateQuickReply';
import { usePubkyClientContext, useModal } from '@/contexts';
import { usePostReplies } from '@/hooks/usePost';
import { PostView } from '@/types/Post';
import { Icon, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';

export const ReplyReplies = ({ reply }: { reply: PostView }) => {
  const { pubky, mutedUsers } = usePubkyClientContext();
  const { openModal } = useModal();
  const { data: replyReplies } = usePostReplies(
    reply?.details?.author,
    reply?.details?.id,
    pubky,
    0,
    1,
    undefined,
    undefined,
    'ascending'
  );
  const lineBaseCSS = `ml-[36px] absolute border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS = (
    <div className="absolute ml-[34px]">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );
  const lineBaseCSS2 = `ml-[11px] absolute border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[62px] after:block after:mt-[-38px] after:-ml-[1px]`;
  const lineHorizontalCSS2 = (
    <div className="absolute ml-[10px] mt-[22px]">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );

  if (!replyReplies || replyReplies.length === 0) return null;

  const filteredReplies = replyReplies.filter((reply) => !mutedUsers?.includes(reply?.details?.author));

  const displayedReplies = filteredReplies.slice(0, 1);

  const mutedRepliesCount = replyReplies.filter((reply) => mutedUsers?.includes(reply?.details?.author)).length;

  const repliesLeft = reply?.counts?.replies - displayedReplies.length - mutedRepliesCount;

  const showQuickReply = displayedReplies.length > 0;

  return (
    <>
      {displayedReplies.map((nestedReply) => (
        <div className="flex flex-col gap-3 ml-6" key={nestedReply?.details?.id}>
          <Post
            post={nestedReply}
            size="full"
            line={Boolean(reply?.relationships?.replied)}
            homeView
            postType="replies"
          />
        </div>
      ))}
      {repliesLeft > 0 && (
        <div>
          <div className={lineBaseCSS} />
          {lineHorizontalCSS}
          <div onClick={() => openModal('postView', { post: reply })}>
            <Typography.Body
              variant="small-bold"
              className="cursor-pointer flex gap-1 items-center ml-14 hover:opacity-80"
            >
              <Icon.PlusCircle />
              {repliesLeft === 1 ? '1 more reply' : `${repliesLeft} more replies`}
            </Typography.Body>
          </div>
        </div>
      )}
      {showQuickReply && (
        <div className="relative ml-6">
          <div className={lineBaseCSS2} />
          {lineHorizontalCSS2}
          <CreateQuickReply post={reply} isNestedReply />
        </div>
      )}
    </>
  );
};
