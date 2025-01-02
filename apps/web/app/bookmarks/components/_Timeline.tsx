'use client';

import { useEffect, useState } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useStreamPost } from '@/hooks/useStream';
import { PostView } from '@/types/Post';
import { Post, Skeleton } from '@/components';
import { useIsMobile } from '@/hooks/useIsMobile';

export const Timeline = () => {
  const limit = 10;
  const { pubky, addBookmark, deleteBookmark } = usePubkyClientContext();
  const [timeline, setTimeline] = useState<PostView[]>([]);
  const [start, setStart] = useState<number | undefined>(undefined);
  const isMobile = useIsMobile();
  const { sort, layout } = useFilterContext();
  const { data, isLoading } = useStreamPost(
    pubky ?? '',
    'bookmarks',
    undefined,
    limit,
    start,
    undefined,
    undefined,
    sort,
  );
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState('');

  const fetchPosts = async () => {
    try {
      if (!data) return;
      if (!Array.isArray(data)) return;

      const lastPost = data[data.length - 1] as PostView;
      if (lastPost.bookmark?.indexed_at) {
        setStart(lastPost.bookmark?.indexed_at - 1);
        setTimeline((prev) => {
          const newPosts = data.filter(
            (post: PostView) =>
              !prev.some((p) => p.bookmark?.id === post.bookmark?.id),
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

  useEffect(() => {
    setStart(undefined);
    setTimeline([]);
    fetchPosts();
  }, [sort]);

  const handleAddBookmark = async (postId: string, authorId: string) => {
    try {
      setLoadingBookmarks(true);
      const result = await addBookmark(postId, authorId);
      if (result) setIsBookmarked(String(result));
      setLoadingBookmarks(false);
    } catch (error) {
      console.log(error);
      setLoadingBookmarks(false);
    }
  };

  const handleDeleteBookmark = async (
    postId: string,
    authorId: string,
    bookmarkId: string,
  ) => {
    try {
      setLoadingBookmarks(true);
      const result = await deleteBookmark(postId, authorId, bookmarkId);
      if (result) setIsBookmarked('');
      setLoadingBookmarks(false);
    } catch (error) {
      console.log(error);
      setLoadingBookmarks(false);
    }
  };

  useEffect(() => {
    if (timeline.length > 0) {
      const bookmarkedPost = timeline.find((post) => post?.bookmark?.id);
      setIsBookmarked(bookmarkedPost?.bookmark?.id ?? '');
    }
  }, [timeline]);

  return (
    <div className="flex flex-col gap-3">
      {timeline.map((post) => (
        <div key={post.details.id} className="flex flex-col">
          <div className="flex gap-2 items-center">
            <Post
              largeView={!isMobile && layout === 'wide'}
              key={`post-${post.details.id}`}
              post={post}
            />
            {post?.details?.content === '[DELETED]' && (
              <>
                {loadingBookmarks ? (
                  <Icon.LoadingSpin size="24" />
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      isBookmarked && post?.bookmark?.id
                        ? handleDeleteBookmark(
                            post?.details?.id,
                            post?.details?.author,
                            post?.bookmark?.id,
                          )
                        : handleAddBookmark(
                            post?.details?.id,
                            post?.details?.author,
                          )
                    }
                  >
                    <Icon.BookmarkSimple
                      size="24"
                      opacity={isBookmarked ? 1 : 0.2}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton.Simple />
        </div>
      )}
      {timeline.length === 0 && !isLoading && (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-50">
            No bookmarks yet.
          </Typography.H2>
        </div>
      )}
      <div ref={loader} />
    </div>
  );
};
