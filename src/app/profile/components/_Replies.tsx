'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@social/ui-shared';
import { ContentNotFound, Post, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import { useStreamPost } from '@/hooks/useStream';
import { Profile } from '.';
import Image from 'next/image';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const limit = 10;
  const { pubky } = usePubkyClientContext();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [start, setStart] = useState<number | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);
  const lineHorizontalCSS = (
    <div className="absolute ml-[9px] -mt-2">
      <Icon.LineHorizontal size="14" color="#444447" />
    </div>
  );

  const currentPubky = creatorPubky ?? pubky ?? '';

  const { data, isLoading } = useStreamPost(
    currentPubky,
    'author_replies',
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
        <div key={`reply-${post.details.id}`} className="flex flex-col gap-3">
          {post?.relationships?.replied && <Profile.ParentPost parentURI={post?.relationships?.replied} />}
          <div className="flex items-center relative">
            <div className={`ml-[9px] absolute border-l-[1px] h-[51%] -top-3 border-[#444447]`} />
            {lineHorizontalCSS}
            <div className="ml-[23px] w-full">
              <Post post={post} />
            </div>
          </div>
        </div>
      ))}
      {(isLoading || fetching) && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      <div ref={loader} />
      {!isLoading && !fetching && timeline.length === 0 && (
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
