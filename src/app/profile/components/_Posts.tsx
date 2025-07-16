'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Icon } from '@social/ui-shared';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { useModal, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import Image from 'next/image';
import { getStreamPosts } from '@/services/streamService';
import { getPost } from '@/services/postService';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const limit = 10;
  const { pubky, setTimeline, timeline, deletedPosts } = usePubkyClientContext();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const { openModal } = useModal();
  const [skip, setSkip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [processedPosts, setProcessedPosts] = useState<Set<string>>(new Set());
  const currentPubky = creatorPubky ?? pubky ?? '';

  // Filter timeline to only show posts that belong to the current profile being viewed
  const filteredTimeline = timeline.filter((post) => {
    // If viewing own profile, show all posts
    if (isMyProfile) {
      return true;
    }
    // If viewing someone else's profile, only show posts by that person
    return post.details.author === currentPubky;
  });

  const fetchPosts = async ({
    skipValue = skip,
    timelineValue = timeline
  }: {
    skipValue?: number;
    timelineValue?: PostView[];
  }) => {
    setIsLoading(true);

    try {
      const data = await getStreamPosts(
        pubky, // viewerId
        'author', // source
        currentPubky, // authorId
        limit, // limit
        undefined, // start
        undefined, // end
        skipValue, // skip
        'recent', // sort
        undefined, // tags
        undefined // kind
      );

      setSkip(skipValue + limit);

      // filter out deleted posts and reset tag relationships if not viewing own profile
      const filteredData = data
        .filter((post) => !deletedPosts.includes(post.details.id))
        .map((post) => {
          if (post.tags) {
            const updatedPost = {
              ...post,
              tags: post.tags.map((tag) => ({
                ...tag,
                relationship: tag.relationship ?? tag.taggers.includes(pubky ?? '')
              }))
            };
            return updatedPost;
          }
          return post;
        });
      setTimeline([...timelineValue, ...filteredData]);
    } catch (error) {
      setFinishedLoading(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNexusData = async () => {
    if (!filteredTimeline.length) return;

    const homeserverPosts = filteredTimeline.filter(
      (post) => (post.cached === 'homeserver' || post.cached === undefined) && !processedPosts.has(post.details.id)
    );
    if (!homeserverPosts.length) return;

    const postToProcess = homeserverPosts[0];

    // Mark this post as being processed
    setProcessedPosts((prev) => new Set([...prev, postToProcess.details.id]));

    let retryCount = 0;
    const maxRetries = 5;

    const attemptFetch = async (): Promise<void> => {
      try {
        const nexusData = await getPost(
          postToProcess.details.author,
          postToProcess.details.id,
          pubky ?? '',
          undefined,
          undefined
        );

        if (!nexusData) {
          if (retryCount < maxRetries) {
            retryCount++;
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            return attemptFetch();
          }
          return;
        }

        // Update the post in timeline with nexus data
        setTimeline((prev) => {
          const existingPost = prev.find((p) => p.details.id === nexusData.details.id);

          if (existingPost) {
            // Preserve optimistic tags if the server data has fewer tags
            const mergedPost = {
              ...nexusData,
              tags:
                nexusData.tags && nexusData.tags.length >= existingPost.tags.length
                  ? nexusData.tags
                  : existingPost.tags,
              counts: {
                ...nexusData.counts,
                tags: Math.max(nexusData.counts?.tags || 0, existingPost.counts?.tags || 0)
              }
            };

            return prev.map((p) => (p.details.id === nexusData.details.id ? mergedPost : p));
          }

          return prev;
        });
      } catch (error) {
        console.log('Error fetching Nexus data:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          return attemptFetch();
        }
      }
    };

    await attemptFetch();
  };

  const initializeTimeline = async () => {
    setSkip(0);
    setFinishedLoading(false);
    setTimeline([]);
    setProcessedPosts(new Set());

    await fetchPosts({
      skipValue: 0,
      timelineValue: []
    });
  };

  useEffect(() => {
    setTimeline([]);
    setSkip(0);
    setFinishedLoading(false);
    setProcessedPosts(new Set());

    fetchPosts({
      skipValue: 0,
      timelineValue: []
    });
  }, [currentPubky]);

  const initializeTimelineCallback = useCallback(() => {
    initializeTimeline();
  }, [creatorPubky]);

  useEffect(() => {
    initializeTimelineCallback();
  }, [creatorPubky]);

  // Fetch Nexus data for homeserver posts
  useEffect(() => {
    if (filteredTimeline.length > 0) {
      fetchNexusData();
    }
  }, [filteredTimeline.length]); // Only depend on length, not the entire array

  const loader = useInfiniteScroll(() => fetchPosts({ skipValue: skip, timelineValue: timeline }), isLoading);

  return (
    <div className="flex flex-col gap-3">
      {filteredTimeline.map((post) => (
        <Post key={`post-${post.details.id}`} post={post} postType="timeline" />
      ))}
      {isLoading && !finishedLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {!isLoading && !finishedLoading && <div ref={loader} />}
      {!isLoading && filteredTimeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Note size="48" color="#C8FF00" />}
          title="No posts yet"
          description={isMyProfile ? 'Start writing your first post.' : 'There are no posts to show.'}
        >
          {isMyProfile && (
            <Button.Medium
              onClick={() => (pubky ? openModal('createPost') : openModal('join'))}
              className="z-10 w-auto"
              icon={<Icon.Plus size="24" />}
            >
              Create a Post
            </Button.Medium>
          )}
          <div className="absolute top-12 z-0">
            <Image alt="not-found-posts" width={656} height={438} src="/images/webp/not-found/posts.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
}
