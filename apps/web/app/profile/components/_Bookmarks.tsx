'use client';

import { useRef } from 'react';
import { Icon, Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { useBookmarkedPosts } from '@/hooks/usePost';

export default function Bookmarks() {
  const { pubky, deleteBookmark } = usePubkyClientContext();
  const { data, isLoading } = useBookmarkedPosts(pubky ?? '', pubky ?? '');
  const results = data;
  const loader = useRef(null);

  {
    /**
  const [cursor, setCursor] = useState('');
  const loader = useRef(null);

  const fetchData = async (pointer: string) => {
    if (results && results) {
      const newPostsTemp = results.reduce((acc: INewPost, post: IPost) => {
        if (post?.bookmark?.id) {
          acc[post.id] = post;
        }
        return acc;
      }, {});

      setPosts((prev: INewPost) => ({ ...prev, ...newPostsTemp }));
      //setCursor(results);
    }
  };

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && cursor) {
      fetchData(cursor);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0,
    });
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useEffect(() => {
    setPosts({} as INewPost);
    setCursor('');
    fetchData('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  */
  }

  const handleDeleteBookmark = async (bookmarkId: string) => {
    await deleteBookmark(bookmarkId);
  };

  return (
    <div id="bookmarks-content" className="flex flex-col gap-3">
      {results &&
        results?.length > 0 &&
        results.map((post) => {
          return (
            <div key={post.details.id} className="flex gap-2 items-center">
              <Post key={post.details.id} post={post} />
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
          );
        })}
      {isLoading && <Skeleton.Simple />}
      {(!results || results?.length === 0) && !isLoading && (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-50">
            No bookmarks yet.
          </Typography.H2>
        </div>
      )}
      <div ref={loader} />
    </div>
  );
}
