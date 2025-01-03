'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@social/ui-shared';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { UseQueryOptions } from '@tanstack/react-query';
import { useFilterContext, usePubkyClientContext } from '@/contexts';

export const NewPostsNotifier = () => {
  const { reach, sort } = useFilterContext();
  const { timeline, setTimeline, pubky } = usePubkyClientContext();
  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [latestTimestamp, setLatestTimestamp] = useState<number | null>(null);

  // Refs for scroll control
  const lastScrollY = useRef(0);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    // Cancel if there's a pending timeout
    if (throttleTimeout.current) return;

    throttleTimeout.current = setTimeout(() => {
      const currentScrollY = window.scrollY;

      // Check if scrolling up and within top 300px
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isNearTop = currentScrollY < 300;

      if (isScrollingUp && isNearTop && !hasFetched) {
        setShouldFetch(true);
        setFetchCounter((prev) => prev + 1);
      }

      lastScrollY.current = currentScrollY;
      throttleTimeout.current = null;
    }, 500); // Wait 500ms between each check
  }, [hasFetched]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clear pending timeout when unmounting
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (timeline.length > 0) {
      const mostRecentTimestamp = Math.max(
        ...timeline.map((post) => post.details.indexed_at),
      );
      setLatestTimestamp(mostRecentTimestamp);
    }
  }, [timeline]);

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
    {
      enabled: shouldFetch && latestTimestamp !== null,
      queryKey: ['stream-posts', fetchCounter, latestTimestamp],
    } as UseQueryOptions<unknown, Error>,
  );

  useEffect(() => {
    if (!newPostsData) return;
    if (!Array.isArray(newPostsData)) return;

    if (newPostsData.length > 0) {
      const filteredNewPosts = newPostsData.filter(
        (post: PostView) =>
          post.details.indexed_at > (latestTimestamp || 0) &&
          !newPosts.some((p) => p.details.id === post.details.id) &&
          !timeline.some((p) => p.details.id === post.details.id),
      );

      if (filteredNewPosts.length > 0) {
        setNewPosts((prev) => [...prev, ...filteredNewPosts]);
        setNewPostsCount((prev) => prev + filteredNewPosts.length);

        // Update latestTimestamp with the most recent post
        const newMostRecent = Math.max(
          ...filteredNewPosts.map((post) => post.details.indexed_at),
        );
        setLatestTimestamp((prev) => Math.max(prev || 0, newMostRecent));
      }
    }

    setHasFetched(true);
    setShouldFetch(false);
  }, [newPostsData, newPosts, timeline, latestTimestamp]);

  const handleShowNewPosts = () => {
    const uniqueNewPosts = newPosts.filter(
      (newPost) =>
        !timeline.some((post) => post.details.id === newPost.details.id),
    );
    setNewPosts([]);
    setTimeline((prev) => [...uniqueNewPosts, ...prev]);
    setNewPostsCount(0);
    setHasFetched(false);
    setShouldFetch(false);
    setFetchCounter(0);
    lastScrollY.current = window.scrollY;
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
};
