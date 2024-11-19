'use client';

import { useRef, useState, useEffect } from 'react';
import { Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';
import { usePostStreamByUser } from '@/hooks/usePost';
import { usePubkyClientContext } from '@/contexts';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const { pubky, timelineProfile, setTimelineProfile } =
    usePubkyClientContext();
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const usePubky = creatorPubky ?? pubky;
  const { data, isLoading, isError } = usePostStreamByUser(
    usePubky ?? '',
    pubky,
    skip,
    limit
  );

  useEffect(() => {
    if (!isLoading && data) {
      if (skip === 0) {
        setTimelineProfile(data);
        return;
      }

      if (!timelineProfile) return;

      const timelineCopy = [...timelineProfile];

      setTimelineProfile([...timelineCopy, ...data]);
    } else {
      setTimelineProfile([]);
    }
  }, [data, isLoading]);

  const fetchMorePosts = () => {
    if (isError) return;
    const newSkip = skip + limit;
    setSkip(newSkip);
  };

  const loader = useInfiniteScroll(fetchMorePosts, isLoading);

  useEffect(() => {
    if (skip === 0 && data) {
      setSkip(0);
    }
  }, [usePubky]);

  if (isError) console.error(isError);

  return (
    <div className="flex flex-col gap-3">
      {timelineProfile &&
        timelineProfile.length > 0 &&
        timelineProfile.map(
          (post) =>
            post?.details?.content !== '[DELETED]' && (
              <Post key={post.details.id} post={post} />
            )
        )}
      {isLoading && <Skeleton.Simple />}
      {timelineProfile && timelineProfile.length === 0 && !isLoading && (
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

function useInfiniteScroll(fetchPosts: () => void, isLoading: boolean) {
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading) {
          fetchPosts();
        }
      },
      { threshold: 0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [fetchPosts, isLoading]);

  return loader;
}
