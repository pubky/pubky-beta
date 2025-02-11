'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useStreamPost } from '@/hooks/useStream';
import { UseQueryOptions } from '@tanstack/react-query';

export function NewPostsNotifier() {
  const { reach, sort, content } = useFilterContext();
  const { timeline, setTimeline, pubky, deletedPosts } =
    usePubkyClientContext();

  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [latestTimestamp, setLatestTimestamp] = useState<number | null>(null);

  // Scroll-related refs
  const lastScrollY = useRef(0);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  // Update latestTimestamp whenever the timeline changes
  useEffect(() => {
    if (timeline.length > 0) {
      const maxIndexedAt = Math.max(
        ...timeline.map((p) => p.details.indexed_at),
      );
      setLatestTimestamp(maxIndexedAt);
    } else {
      setLatestTimestamp(null);
    }
  }, [timeline]);

  // Scroll handler to check if user scrolled up near the top
  const handleScroll = useCallback(() => {
    if (throttleTimeout.current) return;

    throttleTimeout.current = setTimeout(() => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isNearTop = currentScrollY < 300;

      // If user scrolls up and we're near the top, trigger fetch
      if (isScrollingUp && isNearTop) {
        setShouldFetch(true);
      }

      lastScrollY.current = currentScrollY;
      throttleTimeout.current = null;
    }, 500);
  }, []);

  // Add/remove the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, [handleScroll]);

  // Query: fetch posts newer than the latestTimestamp
  const { data: newPostsData } = useStreamPost(
    pubky ?? '',
    reach,
    'all',
    10,
    undefined,
    latestTimestamp ? latestTimestamp + 1 : undefined,
    undefined,
    sort,
    undefined,
    content,
    {
      enabled: shouldFetch && latestTimestamp !== null,
      queryKey: ['new-posts', latestTimestamp],
    } as UseQueryOptions<unknown, Error>,
  );

  // Process new data
  useEffect(() => {
    if (!newPostsData || !Array.isArray(newPostsData)) return;

    if (newPostsData.length > 0) {
      const filtered = newPostsData.filter(
        (post: PostView) =>
          !timeline.some((p) => p.details.id === post.details.id) &&
          !newPosts.some((p) => p.details.id === post.details.id) &&
          !deletedPosts.includes(post.details.id),
      );

      if (filtered.length > 0) {
        setNewPosts((prev) => [...prev, ...filtered]);
        setNewPostsCount((prev) => prev + filtered.length);

        const newMaxTimestamp = Math.max(
          ...filtered.map((p) => p.details.indexed_at),
        );
        setLatestTimestamp((prev) => {
          if (prev === null) return newMaxTimestamp;
          return Math.max(prev, newMaxTimestamp);
        });
      }
    }

    setShouldFetch(false);
  }, [newPostsData, newPosts, timeline]);

  // Handler to merge new posts into the main timeline
  const handleShowNewPosts = () => {
    setTimeline((prev) => [...newPosts, ...prev]);
    setNewPosts([]);
    setNewPostsCount(0);
    setShouldFetch(false);
  };

  return (
    <>
      {newPostsCount > 0 && (
        <Button.Medium
          id="show-new-posts-button"
          className="new-posts-button"
          onClick={handleShowNewPosts}
        >
          Show {newPostsCount} new {newPostsCount > 1 ? 'posts' : 'post'}
        </Button.Medium>
      )}
    </>
  );
}
