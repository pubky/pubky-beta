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
import { getPost } from '@/services/postService';

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
  const { pubky, mutedUsers, newPosts, setNewPosts, timeline, setTimeline } =
    usePubkyClientContext();
  const [start, setStart] = useState<number | undefined>(undefined);
  const isMobile = useIsMobile();
  const { reach, layout, sort, tagsFeed } = useTimelineFilters(selectedFeed);

  const clearTimeline = () => {
    setTimeline([]);
    setStart(undefined);
  };

  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    reach,
    'all',
    10,
    start,
    undefined,
    undefined,
    sort,
    tagsFeed,
  );

  const fetchPosts = async () => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) return;

      const lastPost = data[data.length - 1] as PostView;
      if (!lastPost?.details?.indexed_at) return;

      setStart(lastPost.details.indexed_at - 1);

      setTimeline((prev) => {
        // Filter out muted users and duplicate posts in one pass
        const posts = data.filter(
          (post) =>
            post?.details?.author && // Ensure post has required data
            !mutedUsers?.includes(post.details.author) &&
            !prev.some((p) => p.details.id === post.details.id),
        );

        return posts.length > 0 ? [...prev, ...posts] : prev;
      });
    } catch (error) {
      console.log('Error fetching posts:', error);
      // Could add error handling/user notification here
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    clearTimeline();
    fetchPosts();
  }, [reach, sort, tagsFeed]);

  useEffect(() => {
    return clearTimeline;
  }, [setTimeline, setStart]);

  useEffect(() => {
    const fetchNexusData = async () => {
      if (!newPosts.length) return;

      const homeserverPosts = newPosts.filter(
        (post) => post.cached === 'homeserver' || post.cached === undefined,
      );
      if (!homeserverPosts.length) return;

      try {
        const nexusData = await getPost(
          homeserverPosts[0].details.author,
          homeserverPosts[0].details.id,
          pubky ?? '',
          undefined,
          undefined,
        );

        if (!nexusData) return;

        setNewPosts((prev) => {
          return prev.map((post) => {
            if (post.details.id === nexusData.details.id) {
              return {
                ...post,
                ...nexusData,
                cached: 'nexus',
              };
            }
            return post;
          });
        });
      } catch (error) {
        console.error('Error fetching Nexus data:', error);
      }
    };

    const interval = setInterval(fetchNexusData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [newPosts, pubky, reach, sort, tagsFeed, start]);

  return (
    <div id="timeline" className="flex flex-col gap-3">
      {!isLoading && <NewPostsNotifier />}

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
