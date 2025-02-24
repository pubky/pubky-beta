'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

import { Typography, Button } from '@social/ui-shared';
import { Post } from '@/components';
import Skeletons from '@/components/Skeletons';

import { usePubkyClientContext } from '@/contexts';
import { usePostReplies } from '@/hooks/usePost';
import { ReplyReplies } from './_ReplyReplies';
import { PostView } from '@/types/Post';
import { getPost } from '@/services/postService';

export default function Replies({
  pubkyAuthor,
  postId,
}: {
  pubkyAuthor: string;
  postId: string;
}) {
  const { pubky, setReplies, mutedUsers, replies, deletedPosts } =
    usePubkyClientContext();
  const limit = 5;
  const loaderRef = useRef<HTMLDivElement>(null);

  const [start, setStart] = useState<number | undefined>(undefined);
  const [repliesLocal, setRepliesLocal] = useState<PostView[]>([]);
  const [newReplies, setNewReplies] = useState<PostView[]>([]);
  const [newRepliesCount, setNewRepliesCount] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
    replies.length > 0 ? replies[0]?.details?.indexed_at + 1 : undefined,
    {
      enabled: true,
      // refetchInterval: 3000,
    },
  );

  const mergeReplies = (
    existingReplies: PostView[],
    newReplies: PostView[],
  ) => {
    const existingIds = new Set(existingReplies.map((r) => r.details.id));
    return [
      ...existingReplies,
      ...newReplies.filter((reply) => !existingIds.has(reply.details.id)),
    ];
  };

  const fetchReplies = useCallback(() => {
    if (isLoading || !repliesData) return;

    const filteredReplies = repliesData.filter(
      (reply) =>
        !mutedUsers?.includes(reply.details.author) &&
        !deletedPosts.includes(reply.details.id),
    );

    if (filteredReplies.length > 0) {
      setRepliesLocal((prev) => {
        const updatedReplies = mergeReplies(prev, filteredReplies);
        return updatedReplies.length !== prev.length ? updatedReplies : prev;
      });
      setReplies((prev) => mergeReplies(prev, filteredReplies));
      setStart(
        filteredReplies[filteredReplies.length - 1].details.indexed_at - 1,
      );
    }

    if (filteredReplies.length < limit) {
      setHasMore(false);
    }

    if (!initialLoadComplete) {
      setInitialLoadComplete(true);
      setNewReplies([]);
      setNewRepliesCount(0);
    }

    setIsInitialLoad(false);
  }, [isLoading, repliesData, mutedUsers, initialLoadComplete, deletedPosts]);

  const handleNewReplies = () => {
    setRepliesLocal((prev) => mergeReplies(newReplies, prev));
    setReplies((prev) => mergeReplies(newReplies, prev));
    setNewReplies([]);
    setNewRepliesCount(0);
  };

  useEffect(() => {
    if (newRepliesData) {
      const filteredNewReplies = newRepliesData.filter(
        (reply) =>
          !repliesLocal.some((r) => r.details.id === reply.details.id) &&
          !replies.some((r) => r.details.id === reply.details.id) &&
          !deletedPosts.includes(reply.details.id),
      );

      if (filteredNewReplies.length > 0) {
        setNewReplies((prev) => mergeReplies(prev, filteredNewReplies));
        setNewRepliesCount((prev) => prev + filteredNewReplies.length);
      }
    }
  }, [newRepliesData, replies]);

  useEffect(() => {
    if (!isLoading && repliesData && isInitialLoad) {
      fetchReplies();
    }
  }, [isLoading, repliesData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !isInitialLoad
        ) {
          fetchReplies();
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [
    loaderRef.current,
    hasMore,
    isLoading,
    isInitialLoad,
    start,
    fetchReplies,
  ]);

  useEffect(() => {
    return () => setReplies([]);
  }, []);

  useEffect(() => {
    const fetchNexusData = async () => {
      if (!replies.length) return;

      const homeserverReplies = replies.filter(
        (reply) => reply.cached === 'homeserver' || reply.cached === undefined,
      );
      if (!homeserverReplies.length) return;

      try {
        const nexusData = await getPost(
          homeserverReplies[0].details.author,
          homeserverReplies[0].details.id,
          pubky ?? '',
          undefined,
          undefined,
        );

        if (!nexusData) return;

         // Update replies with nexus data
        setReplies((prev) => {
          const existingReply = prev.find(
            (p) => p.details.id === nexusData.details.id,
          );

          if (
            existingReply &&
            JSON.stringify(existingReply) === JSON.stringify(nexusData)
          ) {
            return prev;
          }
          return prev.map((p) =>
            p.details.id === nexusData.details.id ? nexusData : p,
          );
        });

        // Update local replies as well
        setRepliesLocal((prev) => {
          const existingReply = prev.find(
            (p) => p.details.id === nexusData.details.id,
          );

          if (
            existingReply &&
            JSON.stringify(existingReply) === JSON.stringify(nexusData)
          ) {
            return prev;
          }

          return prev.map((p) =>
            p.details.id === nexusData.details.id ? nexusData : p,
          );
        });
      } catch (error) {
        console.log('Error fetching Nexus data:', error);
      }
    };

    const interval = setInterval(fetchNexusData, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [replies, pubky]);

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
      {replies.length === 0 && newRepliesCount === 0 && !isLoading ? (
        <Typography.Body className="text-opacity-50 text-center mt-[100px]">
          No replies yet.
        </Typography.Body>
      ) : (
        <div className="flex-col gap-3 inline-flex w-full mt-3">
          {replies.map((reply) => (
            <div
              key={`reply-${reply.details.id}`}
              className="flex flex-col gap-3"
            >
              <Post post={reply} />
              {reply.counts?.replies > 0 && <ReplyReplies reply={reply} />}
            </div>
          ))}
          {hasMore && (
            <div
              ref={loaderRef}
              className="h-20 flex items-center justify-center"
            >
              {isLoading && <Skeletons.Simple />}
            </div>
          )}
        </div>
      )}
    </>
  );
}
