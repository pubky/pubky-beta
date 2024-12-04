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
  const [repliesLocal, setRepliesLocal] = useState<PostView[]>([]);
  const [newReplies, setNewReplies] = useState<PostView[]>([]);
  const [newRepliesCount, setNewRepliesCount] = useState(0);
  const lastReplyElementRef = useRef<HTMLDivElement | null>(null);

  const { data: repliesData, isLoading } = usePostReplies(
    pubkyAuthor,
    postId,
    pubky,
    undefined,
    limit,
    start,
  );

  const { data: newRepliesData } = usePostReplies(
    pubkyAuthor,
    postId,
    pubky,
    undefined,
    10,
    undefined,
    repliesLocal.length > 0
      ? repliesLocal[0]?.details?.indexed_at + 1
      : undefined,
    {
      enabled: true,
      refetchInterval: 3000,
    },
  );

  const fetchReplies = () => {
    if (isLoading || !repliesData) return;

    const filteredReplies = repliesData.filter(
      (reply) =>
        !mutedUsers?.includes(reply.details.author) &&
        !repliesLocal.some((r) => r.details.id === reply.details.id),
    );

    if (filteredReplies.length > 0) {
      setRepliesLocal((prev) => [...prev, ...filteredReplies]);
      setReplies((prev) => [...prev, ...filteredReplies]);
      const newStart =
        filteredReplies[filteredReplies.length - 1].details.indexed_at - 1;
      setStart(newStart);
    }
  };

  const handleNewReplies = () => {
    setRepliesLocal((prev) => [...newReplies, ...prev]);
    setReplies((prev) => [...newReplies, ...prev]);
    setNewReplies([]);
    setNewRepliesCount(0);
  };

  useEffect(() => {
    if (newRepliesData) {
      const filteredNewReplies = newRepliesData.filter(
        (reply) => !repliesLocal.some((r) => r.details.id === reply.details.id),
      );
      if (filteredNewReplies.length > 0) {
        setNewReplies((prev) => [...prev, ...filteredNewReplies]);
        setNewRepliesCount((prev) => prev + filteredNewReplies.length);
      }
    }
  }, [newRepliesData]);

  useEffect(() => {
    fetchReplies();
  }, [isLoading, repliesData]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchReplies();
      }
    });

    if (lastReplyElementRef.current) {
      observer.observe(lastReplyElementRef.current);
    }

    return () => {
      if (lastReplyElementRef.current) {
        observer.disconnect();
      }
    };
  }, [repliesLocal]);

  useEffect(() => {
    return () => setReplies([]);
  }, [setReplies]);

  return (
    <>
      {newRepliesCount > 0 && (
        <Button.Medium
          id="show-new-replies-button"
          className="new-posts-button mt-3"
          onClick={handleNewReplies}
        >
          Show {newRepliesCount} new {newRepliesCount > 1 ? 'replies' : 'reply'}
        </Button.Medium>
      )}
      {repliesLocal.length === 0 && newRepliesCount === 0 && !isLoading ? (
        <Typography.Body className="text-opacity-50 text-center mt-[100px]">
          No replies yet.
        </Typography.Body>
      ) : (
        <div className="flex-col gap-3 inline-flex w-full mt-3">
          {repliesLocal.map((reply, index) => (
            <div
              key={reply.details.id}
              ref={
                index === repliesLocal.length - 1 ? lastReplyElementRef : null
              }
              className="flex flex-col gap-3"
            >
              <Post post={reply} />
              {reply.counts?.replies > 0 && <ReplyReplies reply={reply} />}
            </div>
          ))}
          {isLoading && <Skeletons.Simple />}
        </div>
      )}
    </>
  );
}
