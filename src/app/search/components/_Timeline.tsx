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
  const { pubky, searchTags, mutedUsers, setTimeline, timeline } = usePubkyClientContext();
  const [start, setStart] = useState<number | undefined>(undefined);
  const [skip, setSkip] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const isMobile = useIsMobile(1280);
  const { reach, layout, sort, content } = useFilterContext();

  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    reach,
    'all',
    limit,
    sort === 'recent' ? start : undefined,
    undefined,
    sort === 'popularity' ? skip : undefined,
    sort,
    searchTags,
    content
  );

  const fetchPosts = async () => {
    if (fetching || !data) return;
    setFetching(true);

    try {
      if (!Array.isArray(data) || data.length === 0) {
        setTimeline([]);

        setFetching(false);
        return;
      }

      const lastPost = data[data.length - 1] as PostView;

      if (sort === 'recent') {
        if (lastPost.details?.indexed_at) {
          setStart(lastPost.details.indexed_at - 1);
        }
      } else if (sort === 'popularity') {
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
    setStart(undefined);
    setSkip(0);
    setTimeline([]);
    setFetching(false);
    fetchPosts();
  }, [searchTags, reach, sort, content, mutedUsers]);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map((post) => (
        <div key={post.details.id} className="flex gap-2 items-center">
          <Post
            largeView={!isMobile && layout === 'wide'}
            key={`post-${post.details.id}`}
            post={post}
            postType="timeline"
          />
        </div>
      ))}
      {(isLoading || fetching) && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
      {!isLoading && !fetching && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Tag size="48" color="#C8FF00" />}
          title={`No results ${searchTags.length > 0 ? `with the tag: ${searchTags}` : ''}`}
          description="Try searching for something else."
        >
          <div className="absolute top-32 z-0">
            <Image alt="not-found-search" width={477} height={271} src="/images/webp/not-found/search.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
};
