'use client';

import { useEffect, useState } from 'react';
import { Button, Icon } from '@social/ui-shared';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { useModal, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import { useStreamPost } from '@/hooks/useStream';
import Image from 'next/image';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const limit = 10;
  const { pubky } = usePubkyClientContext();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const { openModal } = useModal();
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [start, setStart] = useState<number | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const currentPubky = creatorPubky ?? pubky ?? '';

  const { data, isLoading } = useStreamPost(
    currentPubky,
    'author',
    currentPubky,
    limit,
    start,
    undefined,
    undefined,
    'recent'
  );

  const fetchPosts = async () => {
    if (fetching || !data) return;
    setFetching(true);

    try {
      if (!Array.isArray(data) || data.length === 0) {
        setTimeline([]);

        return;
      }

      const lastPost = data[data.length - 1] as PostView;

      setTimeline((prev) => {
        const newPosts = data.filter((post) => !prev.some((p) => p.details.id === post.details.id));
        return [...prev, ...newPosts];
      });

      if (lastPost?.details?.indexed_at) {
        setStart(lastPost.details.indexed_at - 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setStart(undefined);
    setTimeline([]);
    setFetching(false);
    fetchPosts();
  }, [currentPubky]);

  const loader = useInfiniteScroll(fetchPosts, isLoading);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map((post) => (
        <Post key={`post-${post.details.id}`} post={post} />
      ))}
      {(isLoading || fetching) && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
      {!isLoading && !fetching && timeline.length === 0 && (
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
