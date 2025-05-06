'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Icon } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { PostReplies } from './_PostReplies';
import { useIsMobile } from '@/hooks/useIsMobile';
import { NewPostsNotifier } from './_NewPostsNotifier';
import { getPost } from '@/services/postService';
import Link from 'next/link';
import Image from 'next/image';
import { getStreamPosts } from '@/services/streamService';
import { PostView } from '@/types/Post';

export const Timeline = () => {
  const { pubky, mutedUsers, newPosts, setNewPosts, timeline, setTimeline, deletedPosts } = usePubkyClientContext();
  const { reach, layout, sort, content, selectedFeed } = useFilterContext();

  const isMobile = useIsMobile(1024);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [skip, setSkip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const limit = 10;

  const fetchPosts = async ({
    skipValue = skip,
    timelineValue = timeline
  }: {
    skipValue?: number;
    timelineValue?: PostView[];
  }) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);

    // getStreamPosts
    try {
      const data = await getStreamPosts(
        pubky ?? '', // viewerId
        reach, // source
        undefined, // authorId
        limit, // limit
        undefined, // start
        undefined, // end
        skipValue, // skip
        sort, // sort
        selectedFeed?.tags, // tags
        content // kind
      );

      // Check if the request was aborted
      if (signal.aborted) {
        return;
      }

      setSkip(skipValue + limit);

      // filter out deleted posts, muted users, and ensure content type matches
      const filteredData = data.filter(
        (post) => !deletedPosts.includes(post.details.id) && !mutedUsers.includes(post.details.author)
      );

      setTimeline([...timelineValue, ...filteredData]);
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was aborted, do nothing
        return;
      }
      setFinishedLoading(true);
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const loader = useInfiniteScroll(() => fetchPosts({ skipValue: skip, timelineValue: timeline }), isLoading);

  const initializeTimeline = async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset all state before fetching new data
    setSkip(0);
    setFinishedLoading(false);
    setTimeline([]);
    setNewPosts([]);
    setIsLoading(true);

    try {
      await fetchPosts({
        skipValue: 0,
        timelineValue: []
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Error initializing timeline:', error);
      setFinishedLoading(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNexusData = async () => {
    if (!newPosts.length) return;

    const homeserverPosts = newPosts.filter((post) => post.cached === 'homeserver' || post.cached === undefined);
    if (!homeserverPosts.length) return;

    let retryCount = 0;
    const maxRetries = 5;

    const attemptFetch = async (): Promise<void> => {
      try {
        const nexusData = await getPost(
          homeserverPosts[0].details.author,
          homeserverPosts[0].details.id,
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

        // Remove post from newPosts
        setNewPosts((prev) => prev.filter((post) => post.details.id !== nexusData.details.id));

        // set new post to timeline but update if the post is already in the timeline
        setTimeline((prev) => {
          const existingPost = prev.find((p) => p.details.id === nexusData.details.id);

          if (existingPost) {
            return prev.map((p) => (p.details.id === nexusData.details.id ? nexusData : p));
          }

          return [nexusData, ...prev];
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

  // Cleanup function to cancel any ongoing requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Reset and fetch new data when feed changes
  useEffect(() => {
    initializeTimeline();
  }, [reach, sort, content, selectedFeed?.tags, layout]);

  useEffect(() => {
    fetchNexusData();
  }, [newPosts]);

  return (
    <div id="timeline" className="flex flex-col gap-3">
      {!isLoading && <NewPostsNotifier />}

      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex flex-col">
              <Post largeView={!isMobile && layout === 'wide'} post={post} postType="timeline" />
              {post?.counts?.replies > 0 && <PostReplies isMobile={isMobile} homeView post={post} layout={layout} />}
            </div>
          )
      )}
      {isLoading && !finishedLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {!isLoading && !finishedLoading && <div ref={loader} />}
      {finishedLoading && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Smiley size="48" color="#C8FF00" />}
          title="Welcome to your feed!"
          description={
            <>
              It's a blank slate for now, but not for long.
              <br />
              Start to create posts, follow interesting people, or explore tags.
            </>
          }
        >
          <div className="flex gap-3 z-10 justify-center flex-wrap">
            <Link href="/hot#active">
              <Button.Medium icon={<Icon.UserPlus size="16" />} className="whitespace-nowrap">
                Follow Active Users
              </Button.Medium>
            </Link>
            <Link href="hot">
              <Button.Medium icon={<Icon.Tag size="16" />}>Explore Tags</Button.Medium>
            </Link>
          </div>
          <div className="absolute top-64 z-0">
            <Image alt="not-found-feed" width={434} height={434} src="/images/webp/not-found/feed.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
};
