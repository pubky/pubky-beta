'use client';

import { useState } from 'react';
import { Icon } from '@social/ui-shared';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import { useStreamPost } from '@/hooks/useStream';
import Image from 'next/image';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const { pubky } = usePubkyClientContext();

  const [timeline, setTimeline] = useState<PostView[]>([]);
  const limit = 10;
  const [start, setStart] = useState<number | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchAttempts, setFetchAttempts] = useState<number>(0);

  const { data, isLoading } = useStreamPost(
    creatorPubky ?? pubky ?? '',
    'author',
    creatorPubky ?? pubky ?? '',
    limit,
    start,
  );

  const fetchPosts = async () => {
    setFetching(true);
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        setFetchAttempts((prev) => prev + 1);
        if (fetchAttempts >= 3) setFetching(false);
        return;
      }

      const lastPost = data[data.length - 1] as PostView;
      if (lastPost.details?.indexed_at) {
        setStart(lastPost.details.indexed_at - 1);
        setTimeline((prev) => {
          const newPosts = data.filter(
            (post: PostView) =>
              !prev.some((p) => p.details.id === post.details.id),
          );
          return [...prev, ...newPosts];
        });
      }
      setFetching(false);
    } catch (error) {
      console.error(error);
      setFetching(false);
    }
  };

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <Post key={`post-${post.details.id}`} post={post} />
          ),
      )}
      {(isLoading || fetching) && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
      {!isLoading && !fetching && timeline.length === 0 && (
        <ContentNotFound
          icon={<Icon.Note size="48" color="#C8FF00" />}
          title="No posts yet?"
          description="It's a blank slate for now, but not for long. Start to create posts, follow interesting people, or explore tags that catch your attention. This feed will be full of personalized content, just for you."
        >
          <div className="absolute top-12 z-0">
            <Image
              alt="not-found-posts"
              width={656}
              height={438}
              src="/images/webp/not-found/posts.webp"
            />
          </div>
        </ContentNotFound>
      )}
    </div>
  );
}
