'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography } from '@social/ui-shared';
import { Post } from '@/components';
import Skeletons from '@/components/Skeletons';
import { useClientContext } from '@/contexts';
import { INewPost, IPost } from '@/types';

export default function Bookmarks() {
  const { listBookmarkedPosts, posts, setPosts } = useClientContext();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const loader = useRef(null);

  const fetchData = async (pointer: string) => {
    setLoading(true);

    const results = await listBookmarkedPosts(pointer, 'recent');
    if (results && results.feed) {
      const newPostsTemp = results.feed.reduce((acc: INewPost, post: IPost) => {
        if (post?.bookmark?.id) {
          acc[post.id] = post;
        }
        return acc;
      }, {});

      setPosts((prev: INewPost) => ({ ...prev, ...newPostsTemp }));
      setCursor(results.cursor);
    }

    setLoading(false);
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

  return (
    <div className="flex flex-col gap-3">
      {Object.keys(posts).map((key) => (
        <Post key={posts[key].id} post={posts[key]} />
      ))}
      {Object.keys(posts).length === 0 && !loading && (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-50">
            No bookmarks yet.
          </Typography.H2>
        </div>
      )}
      {loading && <Skeletons.Simple />}
      <div ref={loader} />
    </div>
  );
}
