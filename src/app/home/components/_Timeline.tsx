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
import { groupReposts } from '@/utils/postUtils';

export const Timeline = () => {
  const {
    pubky,
    mutedUsers,
    newPosts,
    setNewPosts,
    timeline,
    setTimeline,
    deletedPosts,
    timelineScroll,
    setTimelineScroll,
    timelineLimit,
    setTimelineLimit,
    isOnline
  } = usePubkyClientContext();
  const { reach, layout, sort, content, selectedFeed } = useFilterContext();

  const isMobile = useIsMobile(1024);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [skip, setSkip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [limit, setLimit] = useState<number>(timelineLimit || 10);

  const fetchPosts = async ({
    skipValue = skip,
    timelineValue = timeline,
    updateGlobalTimeline = false
  }: {
    skipValue?: number;
    timelineValue?: PostView[];
    updateGlobalTimeline?: boolean;
  }): Promise<PostView[]> => {
    // Don't fetch if we're offline
    if (!isOnline) {
      setFinishedLoading(true);
      setIsLoading(false);
      return timelineValue;
    }

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
        return timelineValue;
      }

      setSkip(skipValue + limit);

      // Update global limit if necessary
      if (skipValue + limit > timelineLimit) {
        setTimelineLimit(skipValue + limit);
      }

      // filter out deleted posts, muted users, and ensure content type matches
      const filteredData = data.filter(
        (post) => !deletedPosts.includes(post.details.id) && !mutedUsers.includes(post.details.author)
      );

      // Ensure no duplicates in timeline
      const existingIds = new Set(timelineValue.map((p) => p.details.id));
      const uniqueNewPosts = filteredData.filter((post) => !existingIds.has(post.details.id));

      // Group reposts of the same post together
      const groupedNewPosts = groupReposts(uniqueNewPosts);

      // Combine with existing timeline and group again to handle any new groupings
      const combinedTimeline = [...timelineValue, ...groupedNewPosts];
      const finalTimeline = groupReposts(combinedTimeline);

      // Only sort by indexed_at for recent sorting
      const sortedTimeline =
        sort === 'recent' ? finalTimeline.sort((a, b) => b.details.indexed_at - a.details.indexed_at) : finalTimeline;

      if (updateGlobalTimeline) {
        setTimeline(sortedTimeline);
      }

      // Set finishedLoading to true only if we received no new posts
      if (groupedNewPosts.length === 0) {
        setFinishedLoading(true);
      } else {
        setFinishedLoading(false);
      }

      return sortedTimeline;
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was aborted, do nothing
        return timelineValue;
      }

      setFinishedLoading(true);
      return timelineValue;
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const loader = useInfiniteScroll(
    () => fetchPosts({ skipValue: skip, timelineValue: timeline, updateGlobalTimeline: true }),
    isLoading
  );

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

    // Use a fixed limit for each request
    const fixedLimit = 10;
    setLimit(fixedLimit);

    let tempTimeline: PostView[] = [];
    let currentSkip = 0;
    let hasReachedScrollPosition = false;

    try {
      // Load posts progressively until we have enough to reach the saved scroll position
      while (!hasReachedScrollPosition && currentSkip < (timelineLimit || 100)) {
        const newPosts = await fetchPosts({
          skipValue: currentSkip,
          timelineValue: tempTimeline,
          updateGlobalTimeline: false
        });

        // Only add new posts that aren't already in the timeline
        const uniqueNewPosts = newPosts.filter(
          (newPost) => !tempTimeline.some((existingPost) => existingPost.details.id === newPost.details.id)
        );

        if (uniqueNewPosts.length === 0) {
          // No more posts available
          break;
        }

        tempTimeline = [...tempTimeline, ...uniqueNewPosts];
        currentSkip += fixedLimit;

        // Check if we have enough posts to reach the scroll position
        // For mobile, we need to be more conservative with the height estimation
        const estimatedHeightPerPost = isMobile ? 300 : 200; // Higher estimate for mobile
        const estimatedTotalHeight = tempTimeline.length * estimatedHeightPerPost;

        // Add some buffer for mobile to account for UI elements and varying post heights
        const scrollTarget = isMobile ? timelineScroll + 200 : timelineScroll;

        if (estimatedTotalHeight >= scrollTarget) {
          hasReachedScrollPosition = true;
        }
      }

      setTimeline(tempTimeline);
      setSkip(currentSkip);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Error initializing timeline:', error);
      setFinishedLoading(true);
    } finally {
      setIsLoading(false);
      // After loading, scroll to the saved position with more precise positioning for mobile
      setTimeout(() => {
        if (timelineScroll > 0) {
          // For mobile, we need to account for potential UI elements and adjust the scroll position
          let adjustedScrollPosition = timelineScroll;

          if (isMobile) {
            // Calculate dynamic offset based on viewport height and common mobile UI elements
            const viewportHeight = window.innerHeight;
            const estimatedHeaderHeight = Math.min(viewportHeight * 0.15, 150); // 15% of viewport or max 150px
            const estimatedNavHeight = 60; // Typical mobile navigation height
            const totalOffset = estimatedHeaderHeight + estimatedNavHeight;

            adjustedScrollPosition = Math.max(0, timelineScroll - totalOffset);
          }

          window.scrollTo(0, adjustedScrollPosition);
        }
        setTimelineScroll(0); // Reset scroll position after restoring
      }, 250); // Increased timeout to ensure DOM is ready, especially for mobile
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
            const updatedTimeline = prev.map((p) => (p.details.id === nexusData.details.id ? nexusData : p));
            const groupedTimeline = groupReposts(updatedTimeline);
            return sort === 'recent'
              ? groupedTimeline.sort((a, b) => b.details.indexed_at - a.details.indexed_at)
              : groupedTimeline;
          }

          const newTimeline = [nexusData, ...prev];
          const groupedTimeline = groupReposts(newTimeline);
          return sort === 'recent'
            ? groupedTimeline.sort((a, b) => b.details.indexed_at - a.details.indexed_at)
            : groupedTimeline;
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

  // Add a new effect to reset loading states when connection is restored
  useEffect(() => {
    if (isOnline && finishedLoading) {
      setFinishedLoading(false);
      fetchPosts({ skipValue: skip, timelineValue: timeline });
    }
  }, [isOnline]);

  // Add effect to handle offline state
  useEffect(() => {
    if (!isOnline) {
      setFinishedLoading(true);
      setIsLoading(false);
    }
  }, [isOnline]);

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

  // Save timeline position and limit when user leaves the page or when timeline is stable
  useEffect(() => {
    const handleBeforeUnload = () => {
      setTimelineScroll(window.scrollY);
      setTimelineLimit(timeline.length);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTimelineScroll(window.scrollY);
        setTimelineLimit(timeline.length);
      }
    };

    // Save position when page is about to unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Save position when page becomes hidden (user switches tabs or navigates away)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Save position periodically when timeline is stable (not loading)
    const interval = setInterval(() => {
      if (!isLoading && timeline.length > 0) {
        setTimelineScroll(window.scrollY);
        setTimelineLimit(timeline.length);
      }
    }, 2000); // Save every 2 seconds when stable

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [timeline.length, isLoading, setTimelineScroll, setTimelineLimit]);

  const handleTryAgain = () => {
    window.location.reload();
  };

  // Save position immediately when a post is clicked
  const handlePostClick = () => {
    setTimelineScroll(window.scrollY);
    setTimelineLimit(timeline.length);
  };

  return (
    <div id="timeline" className="flex flex-col gap-3">
      {!isLoading && <NewPostsNotifier />}

      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex flex-col" onClick={handlePostClick}>
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
          icon={isOnline ? <Icon.Smiley size="48" color="#C8FF00" /> : <Icon.Globe size="48" color="#e95164" />}
          title={isOnline ? 'Welcome to your feed!' : 'No internet connection'}
          description={
            isOnline ? (
              <>
                It's a blank slate for now, but not for long.
                <br />
                Start to create posts, follow interesting people, or explore tags.
              </>
            ) : (
              <>It seems you're offline. Please check your internet connection and try again.</>
            )
          }
        >
          <div className="flex gap-3 z-10 justify-center flex-wrap">
            {isOnline ? (
              <>
                <Link href="/hot#active">
                  <Button.Medium icon={<Icon.UserPlus size="16" />} className="whitespace-nowrap">
                    Follow Active Users
                  </Button.Medium>
                </Link>
                <Link href="hot">
                  <Button.Medium icon={<Icon.Tag size="16" />}>Explore Tags</Button.Medium>
                </Link>
              </>
            ) : (
              <Button.Medium className="cursor-pointer" icon={<Icon.Repost size="16" />} onClick={handleTryAgain}>
                Try again
              </Button.Medium>
            )}
          </div>
          <div className="absolute top-64 z-0">
            <Image alt="not-found-feed" width={434} height={434} src="/images/webp/not-found/feed.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
};
