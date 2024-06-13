'use client';

import { useEffect, useRef, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';

import * as Components from '../../components';
import Skeletons from '../../components/Skeletons';
import { Filter } from '../../components/Filter';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import { IPost, INewPost } from '../../types';

export default function Index() {
  const { reach } = useFilterContext();
  const { listGlobalPosts, getPost, posts, setPosts } = useClientContext();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const [parentPosts, setParentPosts] = useState<{
    [key: string]: IPost | null;
  }>({});
  const loader = useRef(null);

  const fetchParentPost = async (parentUri: string): Promise<IPost | null> => {
    try {
      const parentPost = await getPost(parentUri);
      return parentPost;
    } catch (error) {
      console.error('Error fetching parent post:', error);
      return null;
    }
  };

  const fetchData = async (pointer: string) => {
    setLoading(true);

    const results = await listGlobalPosts(pointer, reach);

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
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && cursor) {
          fetchData(cursor);
        }
      },
      { threshold: 0 }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useEffect(() => {
    setPosts({} as INewPost);
    setCursor('');
    fetchData('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reach]);

  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Streams" />
      <Components.RemindBackup />
      <Content.Grid className={'grid grid-cols-5 gap-6'}>
        <Components.Sidebar className="hidden lg:block">
          <Filter.Reach />
          <Filter.Sort />
          <div className="self-start sticky top-[160px]">
            <Filter.Layout />
            <Filter.Content />
          </div>
        </Components.Sidebar>
        <Components.PostsLayout className="col-span-5 lg:col-span-4 xl:col-span-3 flex-col inline-flex gap-6">
          <Components.CreateQuickPost />
          {Object.keys(posts).map((key) => {
            const post = posts[key];
            const parentUri = post.post.parent;
            const parentPost = parentUri ? parentPosts[parentUri] : null;

            return (
              <div key={post.id}>
                {parentPost && (
                  <Components.Post
                    fullContent
                    post={parentPost}
                    className="border-0"
                  />
                )}
                <Components.Post fullContent post={post} />
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
        </Components.PostsLayout>
        <Components.Sidebar className="hidden xl:block">
          <Components.WhoFollow />
          <Components.ActiveFriends />
          <Components.HotTags />
        </Components.Sidebar>
      </Content.Grid>
      <Components.CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
