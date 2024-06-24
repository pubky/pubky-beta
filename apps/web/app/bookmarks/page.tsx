'use client';

import { Content, Typography } from '@social/ui-shared';
import {
  ActiveFriends,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
} from '../../components';
import { useEffect, useRef, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { useFilterContext } from '../../contexts/filters';
import { IPost, INewPost } from '../../types';
import { Filter } from '../../components/Filter';
import Skeletons from '../../components/Skeletons';

{
  /**const layouts = {
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
}; */
}

export default function Index() {
  const { reach } = useFilterContext();
  const { listGlobalPosts, posts, setPosts } = useClientContext();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const loader = useRef(null);
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);
  const filterContentRef = useRef(null);

  const fetchData = async (pointer: string) => {
    setLoading(true);

    const results = await listGlobalPosts(pointer, reach);

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

  {
    /**const postsLayoutClassName =
    layout === 'sidebar'
      ? layouts[layout].posts
      : `grid ${layouts[layout].layout} gap-6`;
  const sidebarClassName = `hidden ${
    layout === 'sidebar' && 'xl:inline-flex w-full'
  }`; */
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFilterContentVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (filterContentRef.current) {
      observer.observe(filterContentRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Bookmarks" />
      <Content.Grid className={'grid grid-cols-5 gap-4'}>
        <Sidebar className="hidden xl:block">
          <div
            className={`self-start ${
              isFilterContentVisible ? '' : 'sticky top-[120px]'
            }`}
          >
            <Filter.Reach />
            <Filter.Sort />
          </div>
          <div ref={filterContentRef}>
            <Filter.Layout />
            <Filter.Content />
          </div>
        </Sidebar>
        <PostsLayout className="col-span-5 xl:col-span-4 2xl:col-span-3 flex-col inline-flex gap-6">
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
        </PostsLayout>
        <Sidebar className="hidden 2xl:block">
          <WhoFollow />
          <ActiveFriends />
          <HotTags />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
