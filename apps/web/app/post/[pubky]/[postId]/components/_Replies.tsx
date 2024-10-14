import { Icon, Typography } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { Post } from '@/components';
import { PostThread, PostView } from '@/types/Post';
import { usePostThread } from '@/hooks/usePost';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';
import Skeletons from '@/components/Skeletons';
import { UseUserMuted } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';

export default function Replies({
  repliesResponse,
  post,
  isLoadingReplies,
}: {
  repliesResponse: PostThread | undefined;
  post: PostView;
  isLoadingReplies: boolean;
}) {
  const { pubky } = usePubkyClientContext();
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');
  const [replies, setReplies] = useState<PostView[]>([]);

  const fetchReplies = async () => {
    try {
      if (repliesResponse) {
        setReplies(repliesResponse.replies || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repliesResponse]);

  const renderReplies = (replies: PostView[]) => {
    return replies
      .filter((reply) => !mutedUsers?.includes(reply?.details?.author))
      .map((reply) => (
        <div className="flex flex-col gap-3" key={reply?.details?.id}>
          <Post post={reply} size="full" />
          {reply?.counts?.replies > 0 && (
            <ReplyReplies post={post} reply={reply} />
          )}
        </div>
      ));
  };

  return (
    <>
      {isLoadingReplies ? (
        <Skeletons.Simple />
      ) : replies && replies.length === 0 ? (
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

const ReplyReplies = ({ reply, post }: { reply: PostView; post: PostView }) => {
  const { pubky } = usePubkyClientContext();
  const { data: replyReplies } = usePostThread(
    reply?.details?.author,
    reply?.details?.id
  );
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');
  const router = useRouter();
  const lineBaseCSS = `ml-[12px] absolute border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[1px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS = (
    <div className="absolute ml-[10px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );
  //const [showAllReplies, setShowAllReplies] = useState(false);

  if (!replyReplies || replyReplies.replies.length === 0) return null;

  const displayedReplies = replyReplies.replies.slice(0, 1);
  //showAllReplies
  //  ? replyReplies.replies
  //  : replyReplies.replies.slice(0, 1);
  const repliesLeft =
    replyReplies?.root_post.counts?.replies - displayedReplies.length;

  return (
    <div>
      {displayedReplies
        .filter(
          (nestedReply) => !mutedUsers?.includes(nestedReply?.details?.author)
        )
        .map((nestedReply) => (
          <div className="flex flex-col gap-3" key={nestedReply?.details?.id}>
            <Post
              post={nestedReply}
              size="full"
              line={Boolean(reply?.relationships?.replied)}
            />
          </div>
        ))}
      {repliesLeft > 0 && (
        //&& !showAllReplies
        <div>
          <div className={lineBaseCSS} />
          {lineHorizontalCSS}
          <Typography.Body
            variant="small-bold"
            //onClick={() => setShowAllReplies(true)}
            onClick={() =>
              router.push(Utils.encodePostUri(reply?.details?.uri))
            }
            className="mt-3 cursor-pointer flex gap-1 items-center ml-8 hover:opacity-80"
          >
            <Icon.ChatCircleText />
            {repliesLeft === 1 ? '1 more reply' : `${repliesLeft} more replies`}
          </Typography.Body>
        </div>
      )}
    </div>
  );
};
