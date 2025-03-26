'use client';

import { Typography } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { Post, Skeleton } from '@/components';
import { useEffect, useState } from 'react';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getStreamPosts } from '@/services/streamService';

const RenderPosts = () => {
  const limit = 10;
  const { pubky, mutedUsers, timeline, setTimeline } = usePubkyClientContext();
  const { hotTagsReach, timeframe } = useFilterContext();
  const [skip, setSkip] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);

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
        pubky ?? '', // viewerId
        'all', // source
        undefined, // authorId
        limit, // limit
        undefined, // start
        undefined, // end
        skipValue, // skip
        'popularity', // sort
        undefined, // tags
        undefined // kind
      );

      setSkip(skipValue + limit);

      // filter out muted users
      const filteredData = data.filter((post) => !mutedUsers?.includes(post.details.author));
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

    await fetchPosts({
      skipValue: 0,
      timelineValue: []
    });
  };

  useEffect(() => {
    initializeTimeline();

    return () => {
      setTimeline([]);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3" id="hot-posts">
      <Typography.H2 className="hidden lg:block text-opacity-50 font-light">Trending Posts</Typography.H2>
      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex gap-2 items-center">
              <Post key={`post-${post.details.id}`} post={post} postType="timeline" />
            </div>
          )
      )}
      {isLoading && !finishedLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {!isLoading && !finishedLoading && <div ref={loader} />}
    </div>
  );
};

export default RenderPosts;
