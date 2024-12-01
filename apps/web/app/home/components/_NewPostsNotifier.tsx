'use client';

import { useEffect, useState } from 'react';
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

  const {
    data: newPostsData,
    isLoading: isNewPostsLoading,
    isError: isNewPostsError,
    error: newPostsError,
  } = useStreamPost(
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
      enabled: true,
      refetchInterval: 10000,
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
  }, [newPostsData]);

  const handleShowNewPosts = () => {
    addNewPosts(newPosts);
    setNewPosts([]);
    setNewPostsCount(0);
  };

  return (
    <>
      {newPostsCount > 0 && (
        <Button.Medium
          className="new-posts-button"
          onClick={handleShowNewPosts}
        >
          Show {newPostsCount} new {newPostsCount > 1 ? 'posts' : 'post'}
        </Button.Medium>
      )}
    </>
  );
};
