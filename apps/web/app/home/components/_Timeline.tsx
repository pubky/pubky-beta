'use client';

import { useEffect, useState } from 'react';
import { Typography } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { Post, Skeleton } from '@/components';
import { PostReplies } from './_PostReplies';
import { useIsMobile } from '@/hooks/useIsMobile';

export const Timeline = () => {
  const limit = 10;
  const { pubky } = usePubkyClientContext();
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
  );

  const fetchPosts = async () => {
    try {
      if (!data) return;
      const lastPost = data[data.length - 1];
      if (lastPost.details?.indexed_at) {
        // TODO: filter by muted users

        setStart(lastPost.details.indexed_at - 1);
        setTimeline((prev) => {
          const newPosts = data.filter(
            (post) => !prev.some((p) => p.details.id === post.details.id),
          );
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
            <div key={post.details.id} className="flex flex-col">
              <Post
                largeView={!isMobile && layout === 'wide'}
                key={`post-${post.details.id}`}
                post={post}
              />
              {post?.counts?.replies > 0 && (
                <PostReplies
                  isMobile={false}
                  homeView
                  post={post}
                  layout={layout}
                />
              )}
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
