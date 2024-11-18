'use client';

import { Fragment, useEffect, useState } from 'react';
import { Typography } from '@social/ui-shared';
import * as Components from '@/components';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { usePostStream } from '@/hooks/usePost';
import { UseUserMuted } from '@/hooks/useUser';
import { ICustomFeed } from '@/types';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PostReplies } from './_PostReplies';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

// Types
interface TimelineProps {
  selectedFeed: ICustomFeed | undefined;
  loadingFeed: boolean;
}

// Helper components
const EmptyTimeline = () => (
  <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
    <Typography.H2 className="font-normal text-opacity-50">
      No posts
    </Typography.H2>
  </div>
);

const LoadingSkeleton = () => (
  <div className="mt-4">
    <Components.Skeleton.Simple />
  </div>
);

const TimelinePost = ({ post, isMobile, layout }) => (
  <div>
    <Components.Post
      post={post}
      largeView={!isMobile && layout === 'wide'}
      line={Boolean(post?.relationships?.replied)}
    />
    {post?.counts?.replies > 0 && (
      <PostReplies isMobile={isMobile} homeView post={post} layout={layout} />
    )}
  </div>
);

// Custom hook to manage filters
const useTimelineFilters = (selectedFeed) => {
  const { reach, layout, sort, setReach, setLayout, setSort } =
    useFilterContext();
  const [tagsFeed, setTagsFeed] = useState<string[]>();

  useEffect(() => {
    if (selectedFeed) {
      setReach(selectedFeed.reach);
      setLayout(selectedFeed.layout);
      setSort(selectedFeed.sort);
      if (selectedFeed?.tags?.length > 0) {
        setTagsFeed(selectedFeed.tags);
      }
    } else {
      setReach('all');
      setLayout('columns');
      setSort('recent');
      setTagsFeed(undefined);
    }
  }, [selectedFeed]);

  return { reach, layout, sort, tagsFeed };
};

const useTimelinePosts = (pubky, skip, limit, reach, sort, tagsFeed) => {
  const { timeline, setTimeline } = usePubkyClientContext();
  const { data, isLoading, isError } = usePostStream(
    pubky,
    skip,
    limit,
    reach,
    sort,
    tagsFeed && tagsFeed?.length > 0 ? tagsFeed : undefined
  );

  useEffect(() => {
    if (!isLoading && data) {
      if (skip === 0) {
        const timelineObj = data.reduce((acc, post) => {
          acc[post.details.id] = post;
          return acc;
        }, {});
        setTimeline(timelineObj);
        return;
      }
      if (!timeline) return;

      const newPosts = data.reduce(
        (acc, post) => {
          acc[post.details.id] = post;
          return acc;
        },
        { ...timeline }
      );
      setTimeline(newPosts);
    }
  }, [data, isLoading, reach]);

  return { timeline, isLoading, isError };
};

export const Timeline = ({ selectedFeed, loadingFeed }: TimelineProps) => {
  const limit = 10;
  const isMobile = useIsMobile();
  const [skip, setSkip] = useState(0);
  const { pubky } = usePubkyClientContext();
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');

  const { reach, layout, sort, tagsFeed } = useTimelineFilters(selectedFeed);
  const { timeline, isLoading, isError } = useTimelinePosts(
    pubky,
    skip,
    limit,
    reach,
    sort,
    tagsFeed
  );

  const fetchMorePosts = () => {
    if (isError) return;
    setSkip(skip + limit);
  };

  const loader = useInfiniteScroll(fetchMorePosts, isLoading);

  const filteredPosts = timeline
    ? Object.values(timeline).filter(
        (post) => !mutedUsers?.includes(post?.details?.author)
      )
    : [];

  return (
    <div className="flex-col inline-flex gap-3">
      {timeline && Object.keys(timeline).length > 0
        ? filteredPosts.map((post) => (
            <Fragment key={post.details.id}>
              {post?.details?.content !== '[DELETED]' && (
                <TimelinePost post={post} isMobile={isMobile} layout={layout} />
              )}
            </Fragment>
          ))
        : !isLoading && <EmptyTimeline />}

      {((isLoading && !isError) || loadingFeed) && <LoadingSkeleton />}
      <div ref={loader} />
    </div>
  );
};
