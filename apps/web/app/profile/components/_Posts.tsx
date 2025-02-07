'use client';

import { useEffect, useState } from 'react';
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

  const { data, isLoading } = useStreamPost(
    creatorPubky ?? pubky ?? '',
    'author',
    creatorPubky ?? pubky ?? '',
    limit,
    start,
  );

  const fetchPosts = async () => {
    try {
      if (!data) return;
      if (!Array.isArray(data)) return;

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
            <Post key={`post-${post.details.id}`} post={post} />
          ),
      )}
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {timeline.length === 0 && !isLoading && (
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
      <div ref={loader} />
    </div>
  );
}
