import { Icon, Typography } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { Post } from '@/components';
import { PostThread, PostView } from '@/types/Post';
import { usePostThread } from '@/hooks/usePost';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';

export default function Replies({
  repliesResponse,
  post,
}: {
  repliesResponse: PostThread | undefined;
  post: PostView;
}) {
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
    return replies.map((reply) => (
      <div className="flex flex-col gap-3" key={reply?.details?.id}>
        <Post post={reply} size="full" />
        <ReplyReplies post={post} reply={reply} />
      </div>
    ));
  };

  return (
    <>
      {replies && replies.length === 0 ? (
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
  const { data: replyReplies } = usePostThread(
    reply?.details?.author,
    reply?.details?.id
  );
  const router = useRouter();
  //const [showAllReplies, setShowAllReplies] = useState(false);

  if (!replyReplies || replyReplies.replies.length === 0) return null;

  const displayedReplies = replyReplies.replies.slice(0, 1);
  //showAllReplies
  //  ? replyReplies.replies
  //  : replyReplies.replies.slice(0, 1);
  const repliesLeft = replyReplies.replies.length - displayedReplies.length;

  return (
    <div>
      {displayedReplies.map((nestedReply) => (
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
        <Typography.Body
          variant="small-bold"
          //onClick={() => setShowAllReplies(true)}
          onClick={() => router.push(Utils.encodePostUri(reply?.details?.uri))}
          className="mt-3 cursor-pointer flex gap-1 items-center ml-6 hover:opacity-80"
        >
          <Icon.ChatCircleText />
          {repliesLeft === 1 ? '1 more reply' : `${repliesLeft} more replies`}
        </Typography.Body>
      )}
    </div>
  );
};
