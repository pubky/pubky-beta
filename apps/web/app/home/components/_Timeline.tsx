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

interface TimelineProps {
  selectedFeed: ICustomFeed | undefined;
}

export const Timeline = ({ selectedFeed }: TimelineProps) => {
  const limit = 10;
  const isMobile = useIsMobile();
  const [skip, setSkip] = useState(0);
  const [tagsFeed, setTagsFeed] = useState<string[]>();

  const { reach, layout, sort, setReach, setLayout, setSort } = useFilterContext();

  useEffect(() => {
    if (selectedFeed) {
      setReach(selectedFeed.reach);
      setLayout(selectedFeed.layout);
      setSort(selectedFeed.sort);
      selectedFeed?.tags &&
        selectedFeed?.tags?.length > 0 &&
        setTagsFeed(selectedFeed?.tags);
    } else {
      setReach('all');
      setLayout('columns');
      setSort('recent');
      setTagsFeed(undefined);
    }
  }, [selectedFeed]);

  const { pubky, timeline, setTimeline } = usePubkyClientContext();
  const { data, isLoading, isError } = usePostStream(
    pubky,
    skip,
    limit,
    reach,
    sort,
    tagsFeed && tagsFeed?.length > 0 ? tagsFeed : undefined
  );
  const { data: mutedUsers } = UseUserMuted(pubky ?? '');

  useEffect(() => {
    setSkip(0);
    setTimeline([]);
  }, [reach]);

  useEffect(() => {
    if (!isLoading && data) {
      if (skip === 0) {
        setTimeline(data);
        return;
      }

      if (!timeline) return;

      const timelineCopy = [...timeline];
      setTimeline([...timelineCopy, ...data]);
    }
  }, [data, isLoading, reach]);

  const fetchMorePosts = () => {
    if (isError) return;
    const newSkip = skip + limit;
    setSkip(newSkip);
  };

  const loader = useInfiniteScroll(fetchMorePosts, isLoading);

  return (
    <div className="flex-col inline-flex gap-3">
      {timeline && timeline?.length > 0
        ? timeline
            .filter((post) => !mutedUsers?.includes(post?.details?.author))
            .map((post, index) => (
              <Fragment key={`${index}-${post.details.id}`}>
                {post?.details?.content === '[DELETED]' ? (
                  ''
                ) : (
                  <div>
                    <Components.Post
                      post={post}
                      largeView={!isMobile && layout === 'wide'}
                      line={Boolean(post?.relationships?.replied)}
                    />
                    {post?.counts?.replies > 0 && (
                      <PostReplies
                        isMobile={isMobile}
                        homeView
                        post={post}
                        layout={layout}
                      />
                    )}
                  </div>
                )}
              </Fragment>
            ))
        : !isLoading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts
              </Typography.H2>
            </div>
          )}
      {isLoading && !isError && (
        <div className="mt-4">
          <Components.Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
    </div>
  );
};
