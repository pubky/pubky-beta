'use client';

import { Content, Icon, Typography } from '@social/ui-shared';
import {
  // ActiveFriends,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
} from '../components';
import { DropDown } from '../components/DropDown';
import { useEffect, useRef, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import { IPost, INewPost } from '../../types';

const layouts = {
  sidebar: {
    layout: 'grid-cols-3',
    posts: 'col-span-3 xl:col-span-2 flex-col inline-flex gap-6',
  },
  grid: {
    layout: 'lg:grid-cols-2 xl:grid-cols-3',
    posts: '',
  },
  columns: {
    layout: 'md:grid-cols-2',
    posts: '',
  },
  list: {
    layout: 'grid-cols-1',
    posts: '',
  },
};

const Loading = (posts: number) => (
  <div className="flex w-full justify-center flex-col">
    <div
      className={`flex w-full justify-center ${posts === 0 ? 'mt-10' : 'mt-2'}`}
    >
      <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
    </div>
    <Typography.Body
      variant="medium-bold"
      className="col-span-3 flex mt-2 justify-center items-center gap-6 text-gray-600"
    >
      Loading Posts
    </Typography.Body>
  </div>
);

export default function Index() {
  const { layout, reach } = useFilterContext();
  const { listGlobalPosts, posts, setPosts } = useClientContext();
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState('');
  const loader = useRef(null);

  const fetchData = async (pointer: string) => {
    if (loading) return;

    setLoading(true);
    const results = await listGlobalPosts(pointer, reach);

    if (results && results.feed) {
      const newPostsTemp = results.feed.reduce((acc: INewPost, post: IPost) => {
        acc[post.id] = post;
        return acc;
      }, {});

      setPosts((prev: INewPost) => ({ ...prev, ...newPostsTemp }));

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

  const postsLayoutClassName =
    layout === 'sidebar'
      ? layouts[layout].posts
      : `grid ${layouts[layout].layout} gap-6`;
  const sidebarClassName = `hidden ${
    layout === 'sidebar' && 'xl:inline-flex w-full'
  }`;

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Streams">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Content />
          <DropDown.Reach />
          <DropDown.SortPosts />
          <DropDown.Layout />
        </div>
      </Header>
      <Content.Grid
        className={layout === 'sidebar' ? 'grid grid-cols-3 gap-6' : ''}
      >
        <PostsLayout className={postsLayoutClassName}>
          {Object.keys(posts).map((key) => (
            <Post
              key={posts[key].id}
              post={posts[key]}
              size={layout === 'list' ? 'full' : 'normal'}
              layout={layout}
            />
          ))}
          {Object.keys(posts).length === 0 && !loading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts yet.
              </Typography.H2>
            </div>
          )}
          {loading && Loading(Object.keys(posts).length)}
        </PostsLayout>
        <Sidebar className={sidebarClassName}>
          <WhoFollow />
          <HotTags />
          {/** <ActiveFriends /> */}
        </Sidebar>{' '}
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
