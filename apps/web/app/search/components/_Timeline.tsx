'use client';

import { useEffect, useState } from 'react';
import { Typography } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { Post, Skeleton } from '@/components';
import { useIsMobile } from '@/hooks/useIsMobile';

export const Timeline = () => {
  const limit = 10;
  const { pubky, searchTags, mutedUsers } = usePubkyClientContext();
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [start, setStart] = useState<number | undefined>(undefined);
  const isMobile = useIsMobile();
  const { reach, layout } = useFilterContext();

  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    reach,
    'all',
    limit,
    start,
    undefined,
    undefined,
    undefined,
    searchTags,
  );

  const fetchPosts = async () => {
    try {
      if (!data) return;
      if (!Array.isArray(data)) return;

      const lastPost = data[data.length - 1] as PostView;
      if (lastPost.details?.indexed_at) {
        setStart(lastPost.details.indexed_at - 1);
        setTimeline((prev) => {
          const newPosts = data.filter((post) => {
            const isMuted = mutedUsers?.includes(post?.details?.author);
            const isAlreadyInTimeline = prev.some(
              (p) => p.details.id === post.details.id,
            );
            return !isMuted && !isAlreadyInTimeline;
          });
          return [...prev, ...newPosts];
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    setTimeline([]);

    return () => {
      setTimeline([]);
    };
  }, [setTimeline]);

  useEffect(() => {
    setStart(undefined);
    setTimeline([]);
    fetchPosts();
  }, [reach]);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex gap-2 items-center">
              <Post
                largeView={!isMobile && layout === 'wide'}
                key={`post-${post.details.id}`}
                post={post}
              />
            </div>
          ),
      )}
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {timeline.length === 0 && !isLoading && (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-50">
            No posts yet.
          </Typography.H2>
        </div>
      )}
      <div ref={loader} />
    </div>
  );
};
