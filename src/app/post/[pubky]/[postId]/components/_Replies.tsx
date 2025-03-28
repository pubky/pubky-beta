'use client';

import React, { useState, useEffect } from 'react';

import { Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';

import { usePubkyClientContext } from '@/contexts';
import { ReplyReplies } from './_ReplyReplies';
import { PostView } from '@/types/Post';
import { getPost, getPostReplies } from '@/services/postService';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Replies({ pubkyAuthor, postId }: { pubkyAuthor: string; postId: string }) {
  const { pubky, setReplies, mutedUsers, replies, deletedPosts } = usePubkyClientContext();
  const limit = 5;
  const [skip, setSkip] = useState<number>(0);

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loader = useInfiniteScroll(() => fetchReplies({ skipValue: skip }), isLoading);

  const fetchReplies = async ({ skipValue = skip }: { skipValue?: number }) => {
    setIsLoading(true);
    try {
      const repliesData = await getPostReplies(
        pubkyAuthor, // author
        postId, // postId
        pubky, // pubky
        limit, // limit
        undefined, // start
        undefined, // end
        skipValue, // skip
        'ascending' // order
      );

      setSkip(skipValue + limit);

      if (repliesData) {
        // filter muted and deleted replies
        const filteredReplies = repliesData.filter(
          (reply) => !mutedUsers.includes(reply.details.author) && !deletedPosts.includes(reply.details.id)
        );
        // If this is the initial load (skipValue is 0), just set the replies
        // Otherwise, append them to maintain chronological order
        if (skipValue === 0) {
          setReplies(filteredReplies);
        } else {
          setReplies((prev) => [...prev, ...filteredReplies]);
        }
      }
    } catch (error) {
      setInitialLoadComplete(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies({ skipValue: 0 });
    // setInterval(fetchNewReplies, 5000);
  }, []);

  const fetchingPost = async (reply: PostView) => {
    const nexusData = await getPost(reply.details.author, reply.details.id, pubky ?? '', undefined, undefined);

    if (!nexusData) return;
    // Update replies with nexus data
    setReplies((prev) => {
      const existingReply = prev.find((p) => p.details.id === nexusData.details.id);
      if (existingReply) {
        return prev.map((p) => (p.details.id === nexusData.details.id ? nexusData : p));
      }
      return prev;
    });
  };

  const fetchNexusData = async () => {
    if (!replies.length) return;

    const homeserverReplies = replies.filter((reply) => reply?.cached === 'homeserver');

    if (!homeserverReplies.length) return;

    const promises = homeserverReplies.map(async (reply) => {
      return fetchingPost(reply);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      // try again after 2 seconds
      console.log('Error fetching Nexus data:', error);
      setTimeout(() => {
        fetchNexusData();
        console.log('try again');
      }, 2000);
    }
  };

  useEffect(() => {
    fetchNexusData();
  }, [replies]);

  return (
    <>
      {replies.length === 0 && initialLoadComplete ? (
        <Typography.Body className="text-opacity-50 text-center mt-[100px]">No replies yet.</Typography.Body>
      ) : (
        <div className="flex-col gap-3 inline-flex w-full">
          {replies.map((reply) => (
            <div key={`reply-${reply.details.id}`} className="flex flex-col gap-3">
              <Post post={reply} postType="replies" />
              {reply.counts?.replies > 0 && <ReplyReplies reply={reply} />}
            </div>
          ))}

          {isLoading && !initialLoadComplete && (
            <div className="h-20 flex items-center justify-center">
              <Skeleton.Simple />
            </div>
          )}
        </div>
      )}
      {!isLoading && !initialLoadComplete && <div ref={loader} />}
    </>
  );
}
