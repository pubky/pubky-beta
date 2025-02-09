'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { useIsMobile } from '@/hooks/useIsMobile';
import Image from 'next/image';

export const Timeline = () => {
  const limit = 10;
  const { pubky, searchTags, mutedUsers } = usePubkyClientContext();
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [start, setStart] = useState<number | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchAttempts, setFetchAttempts] = useState<number>(0);
  const isMobile = useIsMobile(1280);
  const { reach, layout, sort } = useFilterContext();

  const { data, isFetching } = useStreamPost(
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
    setFetching(true);
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        setFetchAttempts((prev) => prev + 1);
        if (fetchAttempts >= 3) setFetching(false);
        return;
      }

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
      setFetching(false);
    } catch (error) {
      console.error(error);
      setFetching(false);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isFetching);

  useEffect(() => {
    setStart(undefined);
    setTimeline([]);
    setFetchAttempts(0);
    fetchPosts();
  }, [searchTags, reach, sort, mutedUsers]);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map((post) => (
        <div key={post.details.id} className="flex gap-2 items-center">
          <Post
            largeView={!isMobile && layout === 'wide'}
            key={`post-${post.details.id}`}
            post={post}
          />
        </div>
      ))}
      {fetching && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {!fetching && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Tag size="48" color="#C8FF00" />}
          title={`No results ${searchTags.length > 0 ? `with the tag: ${searchTags}` : ''}`}
          description="Try searching for something else."
        >
          <div className="absolute top-32 z-0">
            <Image
              alt="not-found-search"
              width={477}
              height={271}
              src="/images/webp/not-found/search.webp"
            />
          </div>
        </ContentNotFound>
      )}
      <div ref={loader} />
    </div>
  );
};
