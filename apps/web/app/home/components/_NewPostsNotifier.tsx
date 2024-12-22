'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@social/ui-shared';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { UseQueryOptions } from '@tanstack/react-query';
import { TSort, TSource } from '@/types';

type NewPostsNotifierProps = {
  latestTimestamp: number;
  pubky: string;
  reach: TSource;
  sort: TSort;
  addNewPosts: (newPosts: PostView[]) => void;
};

export const NewPostsNotifier = ({
  latestTimestamp,
  pubky,
  reach,
  sort,
  addNewPosts,
}: NewPostsNotifierProps) => {
  const [newPosts, setNewPosts] = useState<PostView[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetchCounter, setFetchCounter] = useState(0);

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

  const { data: newPostsData } = useStreamPost(
    pubky,
    reach,
    'all',
    10,
    undefined,
    latestTimestamp + 1,
    undefined,
    sort,
    undefined,
    {
      enabled: shouldFetch,
      queryKey: ['stream-posts', fetchCounter],
    } as UseQueryOptions<unknown, Error>,
  );

  useEffect(() => {
    if (!newPostsData) return;
    if (!Array.isArray(newPostsData)) return;

    if (newPostsData.length > 0) {
      const filteredNewPosts = newPostsData.filter(
        (post: PostView) =>
          !newPosts.some((p) => p.details.id === post.details.id),
      );

      if (filteredNewPosts.length > 0) {
        setNewPosts((prev) => [...prev, ...filteredNewPosts]);
        setNewPostsCount((prev) => prev + filteredNewPosts.length);
      }
    }

    setHasFetched(true);
    setShouldFetch(false);
  }, [newPostsData, newPosts]);

  const handleShowNewPosts = () => {
    addNewPosts(newPosts);
    setNewPosts([]);
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
