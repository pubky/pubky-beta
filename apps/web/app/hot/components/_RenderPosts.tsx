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
  const [start, setStart] = useState<number | undefined>(undefined);
  const { reach, layout, sort } = useFilterContext();
  const isMobile = useIsMobile();
  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    'all',
    undefined,
    limit,
    start,
    undefined,
    undefined,
    'recent',
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
  }, [searchTags, reach, sort]);


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
       {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
         <div ref={loader} />
    </div>
  );
};

export default RenderPosts;
