/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button, Content, Typography } from '@social/ui-shared';
import {
  ActiveFriends,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  Skeleton,
  WhoFollow,
} from '../components';
import { DropDown } from '../components/DropDown';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import { Layouts, IPost } from '../../types';

const layouts: Layouts = {
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

export default function Index() {
  const { layout, reach } = useFilterContext();
  const { refreshList, listGlobalPosts, pubky } = useClientContext();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [cursor, setCursor] = useState('');

  const fetchData = async (pointer: string) => {
    const results = await listGlobalPosts(pointer, reach);

    setShowLoadMore(false);

    if (!results || !results.feed) {
      setCursor('');
      return;
    }

    setPosts(results.feed);

    if (results.feed.length >= 5) {
      setShowLoadMore(true);
    }

    if (results.cursor) {
      setCursor(results.cursor);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData(cursor);
  }, [pubky]);

  useEffect(() => {
    if (refreshList) {
      fetchData('');
    }
  }, [refreshList]);

  const handleLoadMore = async () => {
    try {
      const results = await listGlobalPosts(cursor, reach);

      if (!results || !results.feed) {
        setCursor('');
        return;
      }

      setPosts((prev) => [...prev, ...results.feed]);

      if (!results.cursor) {
        setShowLoadMore(false);
        return;
      }

      setCursor(results.cursor);
    } catch (error) {
      console.log(error);
    }
  };

  const postsLayoutClassName =
    layout === 'sidebar'
      ? layouts[layout].posts
      : `grid ${layouts[layout].layout} gap-6`;
  const sidebarClassName = `hidden ${layout === 'sidebar' && 'xl:inline-flex'}`;

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
          {loading && (
            <Skeleton.Post size={layout === 'list' ? 'full' : 'normal'} />
          )}
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
        </PostsLayout>
        <Sidebar className={sidebarClassName}>
          <WhoFollow />
          <HotTags />
          <ActiveFriends />
        </Sidebar>
        {showLoadMore && (
          <Button.Large
            className="mt-6 col-span-3 xl:col-span-2"
            variant="secondary"
            onClick={() => handleLoadMore()}
          >
            Load More
          </Button.Large>
        )}
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
