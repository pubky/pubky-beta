'use client';

import { useEffect, useState } from 'react';
import { Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';
import { usePostStreamByUser } from '@/hooks/usePost';
import { usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Index() {
  const { pubky, timelineProfile, setTimelineProfile } =
    usePubkyClientContext();
  const limit = 10;
  const [start, setStart] = useState<number | undefined>(undefined);

  const { data, isLoading } = usePostStreamByUser(
    pubky ?? '',
    pubky,
    limit,
    start,
  );

  const fetchPosts = async () => {
    try {
      if (!data) return;

      setStart(data[data.length - 1].details.indexed_at - 1);
      setTimelineProfile((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    setTimelineProfile([]);

    return () => {
      setTimelineProfile([]);
    };
  }, [setTimelineProfile]);

  return (
    <div className="flex flex-col gap-3">
      {timelineProfile.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <Post key={`post-${post.details.id}`} post={post} />
          ),
      )}
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {timelineProfile.length === 0 && !isLoading && (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-50">
            No posts yet.
          </Typography.H2>
        </div>
      )}
      <div ref={loader} />
    </div>
  );
}
