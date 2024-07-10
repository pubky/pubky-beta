import { Typography } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { IReply } from '@/types';
import { Post } from '@/components';

export default function Replies({
  repliesResponse,
}: {
  repliesResponse: IReply;
}) {
  const [replies, setReplies] = useState<IReply[]>([]);

  const fetchReplies = async () => {
    try {
      if (repliesResponse) {
        setReplies(repliesResponse?.replies || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repliesResponse]);

  const renderReplies = (replies: IReply[], depth: number = 0) => {
    return replies.map((reply) => (
      <div key={reply.post.id}>
        <Post
          post={reply.post}
          size="full"
          className={`pl-0 ${
            depth > 0 || reply.replies.length > 0 ? 'border-0' : ''
          }`}
          line={reply.replies.length > 0}
        />
        {reply.replies && reply.replies.length > 0 && (
          <div className="ml-[47px]">
            {renderReplies(reply.replies, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      {replies && replies.length === 0 ? (
        <Typography.Body className="text-opacity-50 text-center mt-6">
          No replies yet
        </Typography.Body>
      ) : (
        <div className="flex-col gap-6 inline-flex w-full mt-6">
          <Typography.H2>Replies</Typography.H2>
          {renderReplies(replies)}
        </div>
      )}
    </>
  );
}
