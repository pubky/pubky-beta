/* eslint-disable react-hooks/exhaustive-deps */
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
import { IPost } from '../../types';

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

const Loading = (posts: IPost[]) => (
  <div className="flex w-full justify-center flex-col">
    <div
      className={`flex w-full justify-center ${
        posts.length === 0 ? 'mt-10' : 'mt-2'
      }`}
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
  const { pubky, refreshList, listGlobalPosts, posts, setPosts } =
    useClientContext();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const loader = useRef(null);

  const fetchData = async (pointer: string) => {
    setLoading(true);
    const results = await listGlobalPosts(pointer, reach);

    if (results && results.feed) {
      if (cursor) {
        setPosts((prev: IPost[]) => [...prev, ...results.feed]);
      } else {
        setPosts(results.feed);
      }
      setCursor(results.cursor);
    }
    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor) {
          fetchData(cursor);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [cursor]);

  useEffect(() => {
    setPosts([]);
    fetchData('');
  }, [reach]);

  useEffect(() => {
    fetchData(cursor);
  }, [pubky, refreshList]);

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
          {posts.map((post, index) => (
            <Post
              key={index}
              post={post}
              size={layout === 'list' ? 'full' : 'normal'}
              layout={layout}
            />
          ))}
          {posts.length === 0 && !loading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts yet.
              </Typography.H2>
            </div>
          )}
          {loading && Loading(posts)}
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
