'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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

export default function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { layout, reach } = useFilterContext();
  const { listGlobalPosts, searchTags, setSearchTags, posts, setPosts } =
    useClientContext();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const loader = useRef(null);

  const fetchData = async (pointer: string, searchTags: string[]) => {
    setLoading(true);

    if (searchTags.length === 0) {
      return;
    }

    const results = await listGlobalPosts(pointer, reach, searchTags);

    if (results && results.feed) {
      if (cursor) {
        setPosts((prev: IPost[]) => [...prev, ...results.feed]);
      } else {
        setPosts(results.feed);
      }
      setCursor(results.cursor);
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor) {
          fetchData(cursor, searchTags);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  useEffect(() => {
    setPosts([]);
    fetchData('', searchTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reach, searchTags]);

  useEffect(() => {
    const search = searchParams.get('tags');

    if (search) {
      const tagsArray = search.split(',');
      setSearchTags(tagsArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const searchTagsString = searchTags.join(',');
    const searchUrl = searchTagsString
      ? `/search?tags=${searchTagsString}`
      : '/search';
    router.replace(searchUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTags]);

  const postsLayoutClassName =
    layout === 'sidebar'
      ? layouts[layout].posts
      : `grid ${layouts[layout].layout} gap-6`;
  const sidebarClassName = `hidden ${
    layout === 'sidebar' && 'xl:inline-flex w-full'
  }`;

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Search">
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
          {posts.map((post) => (
            <Post
              key={post.uri}
              post={post}
              size={layout === 'list' ? 'full' : 'normal'}
              layout={layout}
            />
          ))}
          {posts.length === 0 && !loading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts with{' '}
                {searchTags.length > 1 ? 'these tags:' : 'this tag:'}
              </Typography.H2>
              <Typography.H2 className="font-normal">
                {searchTags.map((searchTag, index) => (
                  <span key={`tag-${searchTag}`}>
                    #{searchTag}
                    {index !== searchTags.length - 1 && ', '}
                  </span>
                ))}
              </Typography.H2>
            </div>
          )}
          {loading && (
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
                className="col-span-3 mt-2 flex justify-center items-center gap-6 text-gray-600"
              >
                Loading Posts
              </Typography.Body>
            </div>
          )}
        </PostsLayout>
        <Sidebar className={sidebarClassName}>
          <WhoFollow />
          <HotTags />
          {/** <ActiveFriends /> */}
        </Sidebar>
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
