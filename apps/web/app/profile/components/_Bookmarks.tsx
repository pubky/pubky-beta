'use client';

import { useEffect, useState } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { useStreamPost } from '@/hooks/usePost';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';

export default function Bookmarks() {
  const { pubky, deleteBookmark } = usePubkyClientContext();

  const [timeline, setTimeline] = useState<PostView[]>([]);
  const limit = 10;
  const [start, setStart] = useState<number | undefined>(undefined);

  const { data, isLoading } = useStreamPost(
    'bookmarks',
    pubky ?? '',
    pubky,
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

  const handleDeleteBookmark = async (bookmarkId: string) => {
    await deleteBookmark(bookmarkId);
  };

  return (
    <div className="flex flex-col gap-3">
      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex gap-2 items-center">
              <Post key={`post-${post.details.id}`} post={post} />
              {post?.details?.content === '[DELETED]' && post?.bookmark?.id && (
                <div
                  onClick={() =>
                    post?.bookmark?.id
                      ? handleDeleteBookmark(post?.bookmark?.id)
                      : undefined
                  }
                  className="cursor-pointer"
                >
                  <Icon.BookmarkSimple opacity="1" />
                </div>
              )}
            </div>
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
