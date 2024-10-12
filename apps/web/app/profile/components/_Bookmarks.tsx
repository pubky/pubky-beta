'use client';

import { useRef } from 'react';
import { Typography } from '@social/ui-shared';
import { Post, Skeleton } from '@/components';
import { usePubkyClientContext } from '@/contexts';
import { useBookmarkedPosts } from '@/hooks/usePost';

export default function Bookmarks() {
  //const { posts } = useClientContext();
  const { pubky } = usePubkyClientContext();
  const { data, isLoading } = useBookmarkedPosts(
    pubky ?? '',
    pubky ?? '',
    0,
    10
  );
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

  return (
    <div id="bookmarks-content" className="flex flex-col gap-3">
      {results &&
        results?.length > 0 &&
        results.map((post) => <Post key={post.details.id} post={post} />)}
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
