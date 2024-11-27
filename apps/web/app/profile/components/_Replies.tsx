'use client';

import { useState, useEffect } from 'react';
import { Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import { useStreamPost } from '@/hooks/useStream';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const limit = 10;

  const { pubky } = usePubkyClientContext();
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [start, setStart] = useState<number | undefined>(undefined);

  const { data, isLoading } = useStreamPost(
    creatorPubky ?? pubky ?? '',
    'author_replies',
    creatorPubky ?? pubky ?? '',
    limit,
    start,
  );

  const fetchPosts = async () => {
    try {
      if (!data) return;

      setStart(data[data.length - 1].details.indexed_at - 1);
      setTimeline((prev) => [...prev, ...data]);
    } catch (error) {
      console.error(error);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  useEffect(() => {
    setTimeline([]);

    return () => {
      setTimeline([]);
    };
  }, [setTimeline]);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <Post key={`reply-${post.details.id}`} post={post} />
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
}
