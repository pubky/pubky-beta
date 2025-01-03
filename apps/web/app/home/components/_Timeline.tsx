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
import { NewPostsNotifier } from './_NewPostsNotifier';
import { ICustomFeed } from '@/types';

interface TimelineProps {
  selectedFeed: ICustomFeed | undefined;
}

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

export const Timeline = ({ selectedFeed }: TimelineProps) => {
  const limit = 10;
  const { pubky, mutedUsers, newPosts, timeline, setTimeline } =
    usePubkyClientContext();
  const [start, setStart] = useState<number | undefined>(undefined);
  const isMobile = useIsMobile();
  const { reach, layout, sort, tagsFeed } = useTimelineFilters(selectedFeed);

  const { data, isLoading, isSuccess } = useStreamPost(
    pubky ?? '',
    reach,
    'all',
    limit,
    start,
    undefined,
    undefined,
    sort,
    tagsFeed,
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
    setStart(undefined);

    return () => {
      setStart(undefined);
      setTimeline([]);
    };
  }, [setTimeline, setStart]);

  useEffect(() => {
    setTimeline([]);
    setStart(undefined);
    fetchPosts();
  }, [reach, sort, tagsFeed]);

  const latestTimestamp =
    timeline.length > 0 ? timeline[0].details.indexed_at : undefined;

  return (
    <div id="timeline" className="flex flex-col gap-3">
      {isSuccess && latestTimestamp && (
        <NewPostsNotifier
          latestTimestamp={latestTimestamp}
          pubky={pubky ?? ''}
          reach={reach}
          sort={sort}
          addNewPosts={(newPosts: PostView[]) => {
            newPosts.forEach((newPost) => {
              if (
                !timeline.some((post) => post.details.id === newPost.details.id)
              ) {
                setTimeline((prev) => [newPost, ...prev]);
              }
            });
          }}
        />
      )}

      {newPosts.map((post) => (
        <div key={post.details.id} className="flex flex-col">
          <Post post={post} />
        </div>
      ))}

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
