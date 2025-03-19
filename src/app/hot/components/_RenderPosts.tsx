'use client';

import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { Post, Skeleton } from '@/components';
import { useStreamPost } from '@/hooks/useStream';
import { useEffect, useState } from 'react';
import { usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const RenderPosts = () => {
  const limit = 10;
  const { pubky, mutedUsers, timeline, setTimeline } = usePubkyClientContext();
  const [skip, setSkip] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);

  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    undefined,
    undefined,
    limit,
    undefined,
    undefined,
    skip,
    'popularity',
    undefined,
    undefined
  );

  const fetchPosts = async () => {
    if (fetching || !data) return;
    setFetching(true);

    try {
      if (!Array.isArray(data) || data.length === 0) {
        setFetching(false);

        return;
      }

      if (data.length > 0) {
        setSkip((prev) => prev + limit);
      }

      setTimeline((prev) => {
        const newPosts = data.filter((post) => {
          const isMuted = mutedUsers?.includes(post?.details?.author);
          const isAlreadyInTimeline = prev.some((p) => p.details.id === post.details.id);
          return !isMuted && !isAlreadyInTimeline;
        });
        return [...prev, ...newPosts];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    if (data) {
      setTimeline(data as PostView[]);
    }
  }, [data]);

  useEffect(() => {
    setTimeline([]);
    setSkip(0);
    setFetching(false);

    return () => {
      setTimeline([]);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3" id="hot-posts">
      <Typography.H2 className="hidden lg:block text-opacity-50 font-light">Trending Posts</Typography.H2>
      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex gap-2 items-center">
              <Post key={`post-${post.details.id}`} post={post} postType="timeline" />
            </div>
          )
      )}
      {(isLoading || fetching) && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
    </div>
  );
};

export default RenderPosts;
