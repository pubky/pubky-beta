'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
} from '@/components';
import { useClientContext, useFilterContext } from '@/contexts';
import { IPost } from '@/types';
import { Filter } from '@/components/Filter';
import Skeletons from '@/components/Skeletons';

const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { layout, reach, sort } = useFilterContext();
  const { listGlobalPosts, searchTags, setSearchTags, posts, setPosts } =
    useClientContext();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);
  const filterContentRef = useRef(null);
  const loader = useRef(null);
  const tagMessage =
    searchTags.length > 1
      ? 'with these tags:'
      : searchTags.length === 1
      ? 'with this tag:'
      : '';

  const fetchData = async (pointer: string, searchTags: string[]) => {
    setLoading(true);

    if (searchTags.length === 0) {
      setLoading(false);
      return;
    }

    const results = await listGlobalPosts(pointer, reach, sort, searchTags);

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
  }, [reach, sort, searchTags]);

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
      <Header className="hidden md:block" title="Search" />
      <Content.Grid className={'grid grid-cols-5 gap-6'}>
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
        <PostsLayout className="col-span-5 xl:col-span-4 2xl:col-span-3 flex-col inline-flex gap-3">
          {Object.keys(posts).map((key, index) => (
            <Post
              key={`${index}-${posts[key].id}`}
              post={posts[key]}
              size={layout === 'list' ? 'full' : 'normal'}
              layout={layout}
            />
          ))}
          {Object.keys(posts).length === 0 && !loading && (
            <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
              <Typography.H2 className="font-normal text-opacity-50">
                No posts {tagMessage}
              </Typography.H2>
              <Typography.H2 className="font-normal">
                {searchTags.map((searchTag, index) => (
                  <span key={`tag-${searchTag}`}>
                    {searchTag}
                    {index !== searchTags.length - 1 && ', '}
                  </span>
                ))}
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
};

export default function Index() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
