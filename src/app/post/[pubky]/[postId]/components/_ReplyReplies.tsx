import { Post } from '@/components';
import CreateQuickReply from '@/components/CreateQuickReply';
import { usePubkyClientContext } from '@/contexts';
import { usePostReplies } from '@/hooks/usePost';
import { PostView } from '@/types/Post';
import { Icon, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';

export const ReplyReplies = ({ reply }: { reply: PostView }) => {
  const { pubky, mutedUsers } = usePubkyClientContext();
  const { data: replyReplies } = usePostReplies(reply?.details?.author, reply?.details?.id, pubky);
  const lineBaseCSS = `ml-[12px] absolute border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS = (
    <div className="absolute ml-[10px]">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );
  const lineBaseCSS2 = `ml-[11px] absolute border-[#444447] after:content-[' * '] after:bg-[#444447] after:w-[1.5px] after:h-[65px] after:block after:-mt-[38px] after:-ml-[1px]`;
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
        <div className="flex flex-col gap-3" key={nestedReply?.details?.id}>
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
          <Link href={Utils.encodePostUri(reply?.details?.uri)}>
            <Typography.Body
              variant="small-bold"
              className="cursor-pointer flex gap-1 items-center ml-8 hover:opacity-80"
            >
              <Icon.PlusCircle />
              {repliesLeft === 1 ? '1 more reply' : `${repliesLeft} more replies`}
            </Typography.Body>
          </Link>
        </div>
      )}
      {showQuickReply && (
        <div className="relative">
          <div className={lineBaseCSS2} />
          {lineHorizontalCSS2}
          <CreateQuickReply post={reply} />
        </div>
      )}
    </>
  );
};
