'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Icon } from '@social/ui-shared';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { useModal, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import Image from 'next/image';
import { getStreamPosts } from '@/services/streamService';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const limit = 10;
  const { pubky, setTimeline, timeline, deletedPosts } = usePubkyClientContext();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const { openModal } = useModal();
  const [skip, setSkip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const currentPubky = creatorPubky ?? pubky ?? '';

  const fetchPosts = async ({
    skipValue = skip,
    timelineValue = timeline
  }: {
    skipValue?: number;
    timelineValue?: PostView[];
  }) => {
    setIsLoading(true);

    try {
      const data = await getStreamPosts(
        currentPubky, // viewerId
        'author', // source
        currentPubky, // authorId
        limit, // limit
        undefined, // start
        undefined, // end
        skipValue, // skip
        'recent', // sort
        undefined, // tags
        undefined // kind
      );

      setSkip(skipValue + limit);

      // filter out deleted posts and reset tag relationships if not viewing own profile
      const filteredData = data
        .filter((post) => !deletedPosts.includes(post.details.id))
        .map((post) => {
          if (!isMyProfile && post.tags) {
            return {
              ...post,
              tags: post.tags.map((tag) => ({
                ...tag,
                relationship: tag.taggers.includes(pubky ?? '')
              }))
            };
          }
          return post;
        });
      setTimeline([...timelineValue, ...filteredData]);
    } catch (error) {
      setFinishedLoading(true);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeTimeline = async () => {
    setSkip(0);
    setFinishedLoading(false);
    setTimeline([]);

    await fetchPosts({
      skipValue: 0,
      timelineValue: []
    });
  };

  useEffect(() => {
    setTimeline([]);
    setSkip(0);
    setFinishedLoading(false);

    fetchPosts({
      skipValue: 0,
      timelineValue: []
    });
  }, [currentPubky]);

  const initializeTimelineCallback = useCallback(() => {
    initializeTimeline();
  }, [creatorPubky]);

  useEffect(() => {
    initializeTimelineCallback();
  }, [creatorPubky]);

  const loader = useInfiniteScroll(() => fetchPosts({ skipValue: skip, timelineValue: timeline }), isLoading);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map((post) => (
        <Post key={`post-${post.details.id}`} post={post} postType="timeline" />
      ))}
      {isLoading && !finishedLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {!isLoading && !finishedLoading && <div ref={loader} />}
      {!isLoading && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Note size="48" color="#C8FF00" />}
          title="No posts yet"
          description={isMyProfile ? 'Start writing your first post.' : 'There are no posts to show.'}
        >
          {isMyProfile && (
            <Button.Medium
              onClick={() => (pubky ? openModal('createPost') : openModal('join'))}
              className="z-10 w-auto"
              icon={<Icon.Plus size="24" />}
            >
              Create a Post
            </Button.Medium>
          )}
          <div className="absolute top-12 z-0">
            <Image alt="not-found-posts" width={656} height={438} src="/images/webp/not-found/posts.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
}
