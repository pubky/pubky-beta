'use client';

import { useEffect, useState } from 'react';
import { Button, Icon } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { PostReplies } from './_PostReplies';
import { useIsMobile } from '@/hooks/useIsMobile';
import { NewPostsNotifier } from './_NewPostsNotifier';
import { ICustomFeed, TContent, TLayouts, TSort, TSource } from '@/types';
import { getPost } from '@/services/postService';
import Link from 'next/link';
import Image from 'next/image';

interface TimelineProps {
  selectedFeed: ICustomFeed | undefined;
}

// Custom hook to manage filters
const useTimelineFilters = (selectedFeed) => {
  const {
    reach,
    layout,
    sort,
    content,
    setReach,
    setLayout,
    setSort,
    setContent,
  } = useFilterContext();
  const [tagsFeed, setTagsFeed] = useState<string[]>();

  useEffect(() => {
    if (selectedFeed) {
      setReach(selectedFeed.reach);
      setLayout(selectedFeed.layout);
      setSort(selectedFeed.sort);
      if (selectedFeed?.tags?.length > 0) {
        setTagsFeed(selectedFeed.tags);
      }
      setContent(selectedFeed.content);
    } else {
      setReach((localStorage.getItem('reach') || 'all') as TSource);
      setLayout((localStorage.getItem('layout') || 'columns') as TLayouts);
      setSort((localStorage.getItem('sort') || 'recent') as TSort);
      setTagsFeed(undefined);
      setContent((localStorage.getItem('content') || 'all') as TContent);
    }
  }, [selectedFeed]);

  return { reach, layout, sort, tagsFeed, content };
};

export const Timeline = ({ selectedFeed }: TimelineProps) => {
  const {
    pubky,
    mutedUsers,
    newPosts,
    setNewPosts,
    timeline,
    setTimeline,
    deletedPosts,
  } = usePubkyClientContext();
  const [start, setStart] = useState<number | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchAttempts, setFetchAttempts] = useState<number>(0);
  const isMobile = useIsMobile(1024);
  const { reach, layout, sort, content, tagsFeed } =
    useTimelineFilters(selectedFeed);

  const clearTimeline = () => {
    setTimeline([]);
    setNewPosts([]);
    setStart(undefined);
    setFetchAttempts(0);
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
    content,
  );

  const fetchPosts = async () => {
    setFetching(true);

    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        setFetchAttempts((prev) => prev + 1);
        if (fetchAttempts >= 3) {
          setFetching(false);
        }
        return;
      }

      const lastPost = data[data.length - 1] as PostView;
      if (!lastPost?.details?.indexed_at) return;

      if (start !== undefined) {
        setStart(lastPost.details.indexed_at - 1);
      }

      setTimeline((prev) => {
        // Filter out muted users and duplicate posts in one pass

        const posts = data.filter(
          (post) =>
            post?.details?.author && // Ensure post has required data
            !mutedUsers?.includes(post.details.author) &&
            !prev.some((p) => p.details.id === post.details.id) &&
            !deletedPosts.includes(post.details.id),
        );

        return posts.length > 0 ? [...prev, ...posts] : prev;
      });
      setFetchAttempts(0);
      setFetching(false);
    } catch (error) {
      console.log('Error fetching posts:', error);
      setFetching(false);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    clearTimeline();
    setTimeout(() => {
      fetchPosts();
    }, 0);
  }, [reach, sort, tagsFeed, content, mutedUsers]);

  useEffect(() => {
    clearTimeline();
  }, []);

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

        // Remove post from newPosts
        setNewPosts((prev) =>
          prev.filter((post) => post.details.id !== nexusData.details.id),
        );

        // set new post to timeline but update if the post is already in the timeline
        setTimeline((prev) => {
          const existingPost = prev.find(
            (p) => p.details.id === nexusData.details.id,
          );

          if (existingPost) {
            return prev.map((p) =>
              p.details.id === nexusData.details.id ? nexusData : p,
            );
          }

          return [nexusData, ...prev];
        });
      } catch (error) {
        console.log('Error fetching Nexus data:', error);
      }
    };

    const interval = setInterval(fetchNexusData, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [newPosts, pubky, reach, sort, tagsFeed, start]);

  return (
    <div id="timeline" className="flex flex-col gap-3">
      {!isLoading && <NewPostsNotifier />}

      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex flex-col">
              <Post largeView={!isMobile && layout === 'wide'} post={post} />
              {post?.counts?.replies > 0 && (
                <PostReplies
                  isMobile={isMobile}
                  homeView
                  post={post}
                  layout={layout}
                />
              )}
            </div>
          ),
      )}
      {(isLoading || fetching) && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {!isLoading && !fetching && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Smiley size="48" color="#C8FF00" />}
          title="Welcome to your feed!"
          description="It's a blank slate for now, but not for long. Start to create posts, follow interesting people, or explore tags that catch your attention. This feed will be full of personalized content, just for you."
        >
          <div className="flex gap-3 z-10 justify-center flex-wrap">
            <Link href="/hot#popular">
              <Button.Medium
                icon={<Icon.UserPlus size="16" />}
                className="whitespace-nowrap"
              >
                Follow Popular
              </Button.Medium>
            </Link>
            <Link href="hot">
              <Button.Medium icon={<Icon.Tag size="16" />}>
                Explore Tags
              </Button.Medium>
            </Link>
          </div>
          <div className="absolute top-64 z-0">
            <Image
              alt="not-found-feed"
              width={434}
              height={434}
              src="/images/webp/not-found/feed.webp"
            />
          </div>
        </ContentNotFound>
      )}
      <div ref={loader} />
    </div>
  );
};
