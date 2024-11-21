'use client';

import React, { useRef, useState, useEffect } from 'react';

import { Typography } from '@social/ui-shared';
import { Post } from '@/components';
import Skeletons from '@/components/Skeletons';

import { usePubkyClientContext } from '@/contexts';
import { getPostReplies } from '@/services/postService';
import { ReplyReplies } from './ReplyReplies';

export default function Replies({
  pubkyAuthor,
  postId,
  postCountReplies,
}: {
  pubkyAuthor: string;
  postId: string;
  postCountReplies: number;
}) {
  const { pubky, replies, setReplies, mutedUsers } = usePubkyClientContext();
  const limit = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [start, setStart] = useState<number | undefined>(undefined);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastReplyElementRef = useRef<HTMLDivElement | null>(null);

  const fetchReplies = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newReplies = await getPostReplies(
        pubkyAuthor,
        postId,
        pubky,
        limit,
        start
      );
      setStart(newReplies[newReplies.length - 1].details.indexed_at - 1);

      if (newReplies && newReplies.length > 0) {
        setReplies((prevReplies) => [...prevReplies, ...newReplies]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setHasMore(false);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setReplies([]);
    fetchReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
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
  }, [isLoading, hasMore, replies]);

  useEffect(() => {
    return () => {
      setReplies([]);
    };
  }, [setReplies]);

  return (
    <>
      {replies.length === 0 && !isLoading ? (
        <Typography.Body className="text-opacity-50 text-center mt-[100px]">
          No replies yet.
        </Typography.Body>
      ) : (
        <div className="flex-col gap-3 inline-flex w-full mt-3">
          {replies
            .filter(
              (reply) => !mutedUsers?.includes(reply?.details?.author) // Filtra i post di utenti mutati
            )
            .map((reply, index) => {
              const isLastReply = replies.length === index + 1;
              return (
                <div
                  key={`reply-${reply.details.id}-${index}`}
                  ref={isLastReply ? lastReplyElementRef : null}
                  className="flex flex-col gap-3"
                >
                  <Post post={reply} />
                  {reply?.counts?.replies > 0 && (
                    <ReplyReplies
                      postCountReplies={postCountReplies}
                      reply={reply}
                    />
                  )}
                </div>
              );
            })}
          {isLoading && <Skeletons.Simple />}
        </div>
      )}
    </>
  );
}
