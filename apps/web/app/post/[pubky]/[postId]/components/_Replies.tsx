import { Typography } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { Post } from '@/components';
import { PostThread, PostView } from '@/types/Post';

export default function Replies({
  repliesResponse,
}: {
  repliesResponse: PostThread | undefined;
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

  const renderReplies = (replies: PostView[], depth: number = 0) => {
    return replies.map((reply) => (
      <div className="flex flex-col gap-3" key={reply?.details?.id}>
        <Post
          post={reply}
          size="full"
          //className={`${
          //  depth > 0 || reply.replies.length > 0 ? 'border-0' : ''
          //}`}
          //line={
          //  !reply.post.post.parent ||
          //  reply.post.post.parent === reply.post.post.root
          //    ? false
          //    : true
          //}
          //lineStyle="after:-ml-[2px]"
        />
        {/**reply.relationships?.replied > 0 && (
          <div className="ml-6">{renderReplies(reply.replies, depth + 1)}</div>
        )*/}
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
          {/**<Typography.H2>Replies</Typography.H2>*/}
          {renderReplies(replies)}
        </div>
      )}
    </>
  );
}
