'use client';

import { useEffect, useRef, useState } from 'react';
import { Content, Menu, Typography } from '@social/ui-shared';
import {
  ActiveFriends,
  ButtonFilters,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
} from '@/components/index';
import { useClientContext, useFilterContext } from '@/contexts';
import { IPost, INewPost } from '@/types/index';
import { Filter } from '@/components/Filter/index';
import Skeletons from '@/components/Skeletons';

export default function Index() {
  const { reach, sort, layout } = useFilterContext();
  const { listBookmarkedPosts, posts, setPosts } = useClientContext();

  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState('');
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);

  const loader = useRef(null);
  const filterContentRef = useRef(null);
  const drawerFilterRef = useRef<HTMLDivElement>(null);

  const fetchData = async (pointer: string) => {
    setLoading(true);

    const results = await listBookmarkedPosts(pointer, sort);
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

  const observeFilterContent = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    setIsFilterContentVisible(entry.isIntersecting);
  };

  const handleClickOutsideDrawer = (event: MouseEvent) => {
    if (
      drawerFilterRef.current &&
      !drawerFilterRef.current.contains(event.target as Node)
    ) {
      setDrawerFilterOpen(false);
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
  }, [reach, sort]);

  useEffect(() => {
    const observer = new IntersectionObserver(observeFilterContent, {
      threshold: 0,
    });
    if (filterContentRef.current) observer.observe(filterContentRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, []);

  const getPostLayoutClass = () => {
    return layout === 'wide'
      ? 'col-span-5'
      : 'col-span-5 lg:col-span-4 xl:col-span-3';
  };

  const renderSidebar = () => {
    if (layout !== 'wide') {
      return (
        <Sidebar className="hidden xl:block">
          <WhoFollow />
          <ActiveFriends />
          <HotTags />
        </Sidebar>
      );
    }
  };

  const renderFilterContent = () => (
    <Sidebar className="hidden xl:block">
      <div
        className={`self-start ${
          isFilterContentVisible ? '' : 'sticky top-[120px]'
        }`}
      >
        <Filter.Sort />
      </div>
      <div ref={filterContentRef}>
        <Filter.Layout />
        <Filter.Content />
      </div>
    </Sidebar>
  );

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Bookmarks" />
      {layout === 'wide' && (
        <ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className="grid grid-cols-5 gap-4">
        {layout !== 'wide' && renderFilterContent()}
        <PostsLayout
          className={`${getPostLayoutClass()} flex-col inline-flex gap-3`}
        >
          {Object.keys(posts).map((key) => (
            <Post
              largeView={layout === 'wide'}
              key={posts[key].id}
              post={posts[key]}
            />
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
        {renderSidebar()}
      </Content.Grid>
      <Menu.Root
        position="left"
        drawerRef={drawerFilterRef}
        drawerOpen={drawerFilterOpen}
      >
        <div className="overflow-y-auto max-h-full no-scrollbar">
          <Filter.Reach />
          <Filter.Sort />
          <Filter.Layout setDrawerFilterOpen={setDrawerFilterOpen} />
          <Filter.Content />
        </div>
      </Menu.Root>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
