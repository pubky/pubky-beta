'use client';

import { useEffect, useState } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { PostView } from '@/types/Post';
import { useStreamPost } from '@/hooks/useStream';

export default function Bookmarks() {
  const { pubky, deleteBookmark } = usePubkyClientContext();

  const [timeline, setTimeline] = useState<PostView[]>([]);
  const limit = 10;
  const [start, setStart] = useState<number | undefined>(undefined);

  const { data, isLoading } = useStreamPost(pubky ?? '', 'bookmarks', undefined, limit, start);

  const fetchPosts = async () => {
    try {
      if (!data) return;
      if (!Array.isArray(data)) return;

      const lastPost = data[data.length - 1] as PostView;
      if (lastPost.details?.indexed_at) {
        setStart(lastPost.details.indexed_at - 1);
        setTimeline((prev) => {
          const newPosts = data.filter((post: PostView) => !prev.some((p) => p.details.id === post.details.id));
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

  const handleDeleteBookmark = async (postId: string, authorId: string) => {
    await deleteBookmark(postId, authorId);
  };

  return (
    <div className="flex flex-col gap-3">
      {timeline.map(
        (post) =>
          post?.details?.content !== '[DELETED]' && (
            <div key={post.details.id} className="flex gap-2 items-center">
              <Post key={`post-${post.details.id}`} post={post} postType="timeline" />
              {post?.details?.content === '[DELETED]' && post?.bookmark?.id && (
                <div
                  onClick={() =>
                    post?.bookmark?.id ? handleDeleteBookmark(post.details.id, post.details.author) : undefined
                  }
                  className="cursor-pointer"
                >
                  <Icon.BookmarkSimple opacity="1" />
                </div>
              )}
            </div>
          )
      )}
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {timeline.length === 0 && !isLoading && (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-50">No posts yet.</Typography.H2>
        </div>
      )}
      <div ref={loader} />
    </div>
  );
}
