'use client';

import React, { useRef, useState, useEffect } from 'react';

import { Typography, Button } from '@social/ui-shared';
import { Post } from '@/components';
import Skeletons from '@/components/Skeletons';

import { usePubkyClientContext } from '@/contexts';
import { usePostReplies } from '@/hooks/usePost';
import { ReplyReplies } from './_ReplyReplies';
import { PostView } from '@/types/Post';

export default function Replies({
  pubkyAuthor,
  postId,
}: {
  pubkyAuthor: string;
  postId: string;
}) {
  const { pubky, setReplies, mutedUsers } = usePubkyClientContext();
  const limit = 5;
  const [start, setStart] = useState<number | undefined>(undefined);
  const [replies, setRepliesLocal] = useState<PostView[]>([]);
  const [newReplies, setNewReplies] = useState<PostView[]>([]);
  const [newRepliesCount, setNewRepliesCount] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastReplyElementRef = useRef<HTMLDivElement | null>(null);

  const { data: repliesData, isLoading } = usePostReplies(
    pubkyAuthor,
    postId,
    pubky,
    undefined,
    limit,
    start,
  );

  const fetchReplies = async () => {
    if (isLoading) return;

    try {
      if (repliesData && repliesData.length > 0) {
        const filteredReplies = repliesData.filter(
          (reply) => !mutedUsers?.includes(reply?.details?.author),
        );

        if (filteredReplies.length > 0) {
          const newStart =
            filteredReplies[filteredReplies.length - 1].details.indexed_at - 1;
          setStart(newStart);
          setRepliesLocal((prevReplies) => [
            ...prevReplies,
            ...filteredReplies.filter(
              (reply) =>
                !prevReplies.some((r) => r.details.id === reply.details.id),
            ),
          ]);
          setReplies((prevReplies) => [
            ...prevReplies,
            ...filteredReplies.filter(
              (reply) =>
                !prevReplies.some((r) => r.details.id === reply.details.id),
            ),
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data: newRepliesData } = usePostReplies(
    pubkyAuthor,
    postId,
    pubky,
    undefined,
    10,
    undefined,
    replies?.[0]?.details?.indexed_at + 1,
    {
      enabled: true,
      refetchInterval: 3000,
    },
  );

  useEffect(() => {
    if (!newRepliesData) return;

    const filteredNewReplies = newRepliesData.filter(
      (reply) => !replies.some((r) => r.details.id === reply.details.id),
    );

    if (filteredNewReplies.length > 0) {
      setNewReplies((prev) => [...prev, ...filteredNewReplies]);
      setNewRepliesCount((prev) => prev + filteredNewReplies.length);
    }
  }, [newRepliesData, replies]);

  const handleShowNewReplies = () => {
    setRepliesLocal((prev) => [...newReplies, ...prev]);
    setNewReplies([]);
    setNewRepliesCount(0);
  };

  useEffect(() => {
    if (isLoading) return;

    fetchReplies();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchReplies();
      }
    });

    if (lastReplyElementRef.current) {
      observer.current.observe(lastReplyElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, replies]);

  return (
    <>
      {newRepliesCount > 0 && (
        <Button.Medium
          id="show-new-replies-button"
          className="new-posts-button mt-3"
          onClick={handleShowNewReplies}
        >
          Show {newRepliesCount} new {newRepliesCount > 1 ? 'replies' : 'reply'}
        </Button.Medium>
      )}
      {replies.length === 0 && !isLoading ? (
        <Typography.Body className="text-opacity-50 text-center mt-[100px]">
          No replies yet.
        </Typography.Body>
      ) : (
        <div className="flex-col gap-3 inline-flex w-full mt-3">
          {replies.reverse().map((reply, index) => {
            const isLastReply = replies.length === index + 1;
            return (
              <div
                key={`reply-${reply.details.id}-${index}`}
                ref={isLastReply ? lastReplyElementRef : null}
                className="flex flex-col gap-3"
              >
                <Post post={reply} />
                {reply?.counts?.replies > 0 && <ReplyReplies reply={reply} />}
              </div>
            );
          })}
          {isLoading && <Skeletons.Simple />}
        </div>
      )}
    </>
  );
}
