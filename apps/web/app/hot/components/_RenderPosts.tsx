'use client';

import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { Post, Skeleton } from '@/components';
import { useStreamPost } from '@/hooks/useStream';
import { useEffect, useState } from 'react';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useIsMobile } from '@/hooks/useIsMobile';

const RenderPosts = () => {
  const limit = 10;
  const { pubky, searchTags, mutedUsers } = usePubkyClientContext();
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchAttempts, setFetchAttempts] = useState<number>(0);
  const { reach, layout } = useFilterContext();
  const isMobile = useIsMobile();

  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    'all',
    undefined,
    limit,
    undefined,
    undefined,
    skip,
    'popularity',
    undefined,
    undefined,
  );

  const fetchPosts = async () => {
    if (fetching || !data) return;
    setFetching(true);

    try {
      if (!Array.isArray(data) || data.length === 0) {
        setFetchAttempts((prev) => prev + 1);
        if (fetchAttempts >= 3) {
          setFetching(false);
        }
        return;
      }

      setFetchAttempts(0);

      if (data.length > 0) {
        setSkip((prev) => prev + limit);
      }

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
    } catch (error) {
      console.error(error);
      setFetchAttempts((prev) => prev + 1);
    } finally {
      setFetching(false);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    setTimeline([]);
    setSkip(0);
    setFetchAttempts(0);
    setFetching(false);

    return () => {
      setTimeline([]);
    };
  }, [searchTags, reach]);

  return (
    <div className="flex flex-col gap-3" id="hot-posts">
      <Typography.H2 className="hidden lg:block text-opacity-50 font-light">
        Hot Posts
      </Typography.H2>
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
