'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Icon } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { useIsMobile } from '@/hooks/useIsMobile';
import Image from 'next/image';
import { getStreamPosts } from '@/services/streamService';
import Link from 'next/link';

export const Timeline = () => {
  const limit = 10;
  const { pubky, searchTags, mutedUsers, setTimeline, timeline, deletedPosts } = usePubkyClientContext();
  const [start, setStart] = useState<number | undefined>(undefined);
  const [skip, setSkip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const isMobile = useIsMobile(1280);
  const { reach, layout, sort, content } = useFilterContext();

  const fetchPosts = async ({
    skipValue = 0,
    timelineValue = timeline
  }: {
    skipValue?: number;
    timelineValue?: PostView[];
  }) => {
    setIsLoading(true);

    try {
      const data = await getStreamPosts(
        pubky ?? '', // viewerId
        reach, // source
        undefined, // authorId
        limit, // limit
        start, // start
        undefined, // end
        skipValue, // skip
        sort, // sort
        searchTags, // tags
        content // kind
      );

      setSkip(skipValue + limit);

      // filter out deleted posts and muted users
      const filteredData = data.filter(
        (post) => !deletedPosts.includes(post.details.id) && !mutedUsers.includes(post.details.author)
      );
      setTimeline([...timelineValue, ...filteredData]);
    } catch (error) {
      setFinishedLoading(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loader = useInfiniteScroll(() => fetchPosts({ skipValue: skip, timelineValue: timeline }), isLoading);

  const initializeTimeline = async () => {
    setSkip(0);
    setFinishedLoading(false);
    setTimeline([]);
    setStart(undefined);

    await fetchPosts({
      skipValue: 0,
      timelineValue: []
    });
  };

  const initializeTimelineCallback = useCallback(() => {
    initializeTimeline();
  }, [reach, sort, content, searchTags, layout]);

  useEffect(() => {
    initializeTimelineCallback();
  }, [reach, sort, content, searchTags, layout]);

  return (
    <div id="post-search-results" className="flex flex-col gap-3">
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
      {isLoading && !finishedLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {!isLoading && !finishedLoading && <div ref={loader} />}
      {finishedLoading && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Tag size="48" color="#C8FF00" />}
          title={`No results ${searchTags.length > 0 ? `with the tag: ${searchTags}` : ''}`}
          description="Try searching for something else."
        >
          <div className="md:hidden flex gap-3 justify-center flex-wrap">
            <Link href="/home">
              <Button.Medium icon={<Icon.House size="16" />}>Go back home</Button.Medium>
            </Link>
          </div>
          <div className="absolute top-32 z-0">
            <Image alt="not-found-search" width={477} height={271} src="/images/webp/not-found/search.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
};
