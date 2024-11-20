'use client';

import { Fragment, useEffect, useState } from 'react';
import { Typography } from '@social/ui-shared';
import * as Components from '@/components';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { usePostStream } from '@/hooks/usePost';
import { UseUserMuted } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

// Helper components
const EmptyTimeline = ({ searchTags }) => {
  const tagMessage =
    searchTags.length > 1
      ? 'with these tags:'
      : searchTags.length === 1
      ? 'with this tag:'
      : '';
  return (
    <div className="mt-[100px] col-span-3 flex flex-col justify-center items-center gap-2">
      <Typography.H2 className="font-normal text-opacity-50">
        No posts {tagMessage}
      </Typography.H2>
      <Typography.H2 className="font-normal break-all">
        {searchTags.map((searchTag, index) => (
          <span key={`tag-${searchTag}`}>
            {searchTag}
            {index !== searchTags.length - 1 && ', '}
          </span>
        ))}
      </Typography.H2>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="mt-4">
    <Components.Skeleton.Simple />
  </div>
);

const TimelinePost = ({ post, isMobile, layout }) => (
  <div>
    <Components.Post post={post} largeView={!isMobile && layout === 'wide'} />
  </div>
);

const useTimelinePosts = (pubky, skip, limit, reach, sort, searchTags) => {
  const { timeline, setTimeline } = usePubkyClientContext();
  const { data, isLoading, isError } = usePostStream(
    pubky,
    skip,
    limit,
    reach,
    sort,
    searchTags
  );

  useEffect(() => {
    if (!isLoading) {
      if (data) {
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
    }
  }, [data, isLoading, reach]);

  return { timeline, isLoading, isError };
};

export const Timeline = () => {
  const limit = 10;
  const isMobile = useIsMobile();
  const [skip, setSkip] = useState(0);
  const { pubky, searchTags } = usePubkyClientContext();
  const { layout, reach, sort } = useFilterContext();
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');
  const { timeline, isLoading, isError } = useTimelinePosts(
    pubky,
    skip,
    limit,
    reach,
    sort,
    searchTags
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
        : !isLoading && <EmptyTimeline searchTags={searchTags} />}

      {isLoading && !isError && <LoadingSkeleton />}
      <div ref={loader} />
    </div>
  );
};
