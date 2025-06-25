'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@social/ui-shared';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { useModal, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import { Profile } from '.';
import Image from 'next/image';
import { getStreamPosts } from '@/services/streamService';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const limit = 10;
  const { pubky, deletedPosts } = usePubkyClientContext();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const [skip, setSkip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [timeline, setTimeline] = useState<PostView[]>([]);
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
        pubky, // viewerId
        'author_replies', // source
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
          if (post.tags) {
            const updatedPost = {
              ...post,
              tags: post.tags.map((tag) => ({
                ...tag,
                relationship: tag.relationship ?? tag.taggers.includes(pubky ?? '')
              }))
            };
            return updatedPost;
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

  const lineHorizontalCSS = (
    <div className="absolute ml-[9px] -mt-2">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {timeline.map((post) => (
        <div key={`reply-${post.details.id}`} className="flex flex-col gap-3">
          {post?.relationships?.replied && <Profile.ParentPost parentURI={post?.relationships?.replied} />}
          <div className="flex items-center relative">
            <div className={`ml-[9px] absolute border-l-[1px] h-[51%] -top-3 border-[#444447]`} />
            {lineHorizontalCSS}
            <div className="ml-[23px] w-full">
              <Post post={post} postType="replies" />
            </div>
          </div>
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
          icon={<Icon.NoteBlank size="48" color="#C8FF00" />}
          title="No replies yet"
          description={isMyProfile ? 'Start writing your first reply.' : 'There are no replies to show.'}
        >
          <div className="absolute top-12 z-0">
            <Image alt="not-found-replies" width={656} height={438} src="/images/webp/not-found/posts.webp" />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
}
