'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography } from '@social/ui-shared';
import { Post } from '@/components';
import { useClientContext } from '@/contexts';
import { IPost, INewPost } from '@/types';
import Skeletons from '@/components/Skeletons';

export default function Index({ creatorPubky }: { creatorPubky?: string }) {
  const { pubky, listUserFeed, getPost, posts, setPosts } = useClientContext();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const [parentPosts, setParentPosts] = useState<{
    [key: string]: IPost | null;
  }>({});
  const loader = useRef(null);

  async function fetchPosts(
    pointer: string,
    cancellationToken: { cancelled: boolean }
  ) {
    try {
      setLoading(true);

      if (!pubky) return;

      let results;

      if (creatorPubky) {
        results = await listUserFeed(creatorPubky, pointer);
      } else {
        results = await listUserFeed(pubky, pointer);
      }

      if (cancellationToken.cancelled) return;

      if (results && results.feed) {
        const newPostsTemp = await Promise.all(
          results.feed.map(async (post: IPost) => {
            let parentPost: IPost | null = null;
            if (post.post.parent) {
              parentPost = await fetchParentPost(post.post.parent);
              setParentPosts((prev) => ({
                ...prev,
                [post.post.parent!]: parentPost,
              }));
            }
            return post;
          })
        );

        const postsMap = newPostsTemp.reduce((acc: INewPost, post) => {
          acc[post.id] = post;
          return acc;
        }, {});

        setPosts((prev: INewPost) => ({ ...prev, ...postsMap }));

        setCursor(results.cursor);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchParentPost(parentUri: string): Promise<IPost | null> {
    try {
      const parentPost = await getPost(parentUri);
      return parentPost;
    } catch (error) {
      console.error('Error fetching parent post:', error);
      return null;
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor) {
          const cancellationToken = { cancelled: false };
          fetchPosts(cursor, cancellationToken);
          return () => {
            cancellationToken.cancelled = true;
          };
        }
      },
      { threshold: 1 }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [cursor]);

  useEffect(() => {
    setPosts({} as INewPost);
    const cancellationToken = { cancelled: false };
    fetchPosts('', cancellationToken);
    return () => {
      cancellationToken.cancelled = true;
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <>
      {Object.keys(posts).map((key) => {
        const post = posts[key];
        const parentUri = post?.post?.parent;
        const parentPost = parentUri ? parentPosts[parentUri] : null;

        return (
          <div key={post.id}>
            {parentPost ? (
              <Post post={parentPost} className="border-0" line />
            ) : parentUri ? (
              <div className="relative ml-4 mb-8 px-6 py-2 bg-white bg-opacity-10 rounded-2xl w-[300px]">
                <Typography.Body variant="small" className="text-opacity-50">
                  This post was not found or has been deleted by its author.
                </Typography.Body>
                <div className="absolute -ml-1 mt-1.5 border-l-2 border-neutral-800 h-[35px]" />
              </div>
            ) : null}
            <Post post={post} />
          </div>
        );
      })}
      {Object.keys(posts).length === 0 && !loading && (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-50">
            No posts yet.
          </Typography.H2>
        </div>
      )}
      {loading && <Skeletons.Simple />}
      <div ref={loader} />
    </>
  );
}
