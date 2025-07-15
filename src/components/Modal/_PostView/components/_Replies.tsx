'use client';

import React, { useState, useEffect } from 'react';

import { Icon, Typography } from '@social/ui-shared';
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
  const [hasMore, setHasMore] = useState(true);
  const lineBaseCSS = 'absolute left-[10px] top-[0px] w-[1px] h-[calc(100%+12px)] bg-[#444447]';
  const lineBaseCSS2 = `ml-[10px] absolute left-0 top-0 h-[49%] border-l-[1px] border-[#444447] w-0`;

  const loader = useInfiniteScroll(() => {
    if (hasMore && !isLoading) {
      fetchReplies({ skipValue: skip });
    }
  }, isLoading || !hasMore);

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

      if (repliesData && repliesData.length > 0) {
        // filter muted and deleted replies
        const filteredReplies = repliesData.filter(
          (reply) => !mutedUsers.includes(reply.details.author) && !deletedPosts.includes(reply.details.id)
        );

        // Check if we have more data to load
        setHasMore(repliesData.length === limit);

        // If this is the initial load (skipValue is 0), just set the replies
        // Otherwise, append them to maintain chronological order
        if (skipValue === 0) {
          setReplies(filteredReplies);
        } else {
          setReplies((prev) => [...prev, ...filteredReplies]);
        }
      } else {
        // If no replies data, ensure we set an empty array and mark as no more data
        setHasMore(false);
        if (skipValue === 0) {
          setReplies([]);
        }
      }
    } catch (error) {
      setInitialLoadComplete(true);
      setHasMore(false);
      if (skipValue === 0) {
        setReplies([]);
      }
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  // Reset state when post changes
  useEffect(() => {
    // Clear any existing replies immediately when post changes
    setReplies([]);
    setSkip(0);
    setInitialLoadComplete(false);
    setIsLoading(true);
    setHasMore(true);

    // Fetch new replies for the current post
    fetchReplies({ skipValue: 0 });
  }, [pubkyAuthor, postId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setReplies([]);
      setSkip(0);
      setInitialLoadComplete(false);
      setHasMore(true);
    };
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
        <Typography.Body className="text-opacity-50 text-center mt-[50px]">No replies yet.</Typography.Body>
      ) : (
        <div className="flex-col gap-3 inline-flex w-full relative">
          {replies.map((reply, index) => {
            const isLastReply = index === replies.length - 1;
            if (isLastReply) {
              return (
                <div key={`reply-${reply.details.id}`} className="flex flex-col gap-3 relative">
                  <div className="relative">
                    <div className={lineBaseCSS2} />
                    <div className="flex items-center relative">
                      <div className="absolute ml-[10px]">
                        <Icon.LineHorizontal size="14" color="#444447" />
                      </div>
                      <Post className="ml-6" post={reply} postType="replies" />
                    </div>
                  </div>
                  {reply.counts?.replies > 0 && <ReplyReplies reply={reply} />}
                </div>
              );
            } else {
              return (
                <div key={`reply-${reply.details.id}`} className="flex flex-col gap-3 relative">
                  <div className={lineBaseCSS} />
                  <div className="flex items-center relative">
                    <div className="absolute ml-[10px]">
                      <Icon.LineHorizontal size="14" color="#444447" />
                    </div>
                    <Post className="ml-6" post={reply} postType="replies" />
                  </div>
                  {reply.counts?.replies > 0 && <ReplyReplies reply={reply} />}
                </div>
              );
            }
          })}

          {isLoading && !initialLoadComplete && (
            <div className="h-20 flex items-center justify-center">
              <Skeleton.Simple />
            </div>
          )}
        </div>
      )}

      {/* Loader for infinite scroll - always visible when there's more data */}
      {hasMore && <div ref={loader} className="h-10" />}

      {/* Loading indicator for subsequent loads */}
      {isLoading && initialLoadComplete && (
        <div className="h-20 flex items-center justify-center">
          <Skeleton.Simple />
        </div>
      )}
    </>
  );
}
