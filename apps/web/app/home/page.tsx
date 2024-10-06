'use client';

import { useEffect, useRef, useState } from 'react';
import { Content, Menu } from '@social/ui-shared';
import * as Components from '@/components';
import { Filter } from '@/components/Filter';
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { usePostStream } from '@/hooks/usePost';

export default function Index() {
  const { layout } = useFilterContext();
  const { pubky } = usePubkyClientContext();
  const { data, isLoading } = usePostStream(pubky, 0, 5);
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [isFilterContentVisible, setIsFilterContentVisible] = useState(true);
  const loader = useRef(null);
  const filterContentRef = useRef(null);
  const drawerFilterRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      if (
        drawerFilterRef.current &&
        !drawerFilterRef.current.contains(event.target as Node)
      ) {
        setDrawerFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [drawerFilterRef]);

  function getPostsLayoutClass(layout: string) {
    return layout === 'wide'
      ? 'col-span-5'
      : 'col-span-5 lg:col-span-4 xl:col-span-3';
  }

  function getSidebarClass(isFilterContentVisible: boolean) {
    return isFilterContentVisible ? '' : 'sticky top-[120px]';
  }

  return (
    <Content.Main>
      <Components.Header className="hidden md:block" title="Feed" />
      <Components.RemindBackup />
      {layout === 'wide' && (
        <Components.ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className="grid grid-cols-5 gap-6">
        {layout !== 'wide' && (
          <Components.Sidebar className="hidden lg:block">
            <div
              className={`self-start ${getSidebarClass(
                isFilterContentVisible
              )}`}
            >
              <Filter.Reach />
              <Filter.Sort />
            </div>
            <div ref={filterContentRef}>
              <Filter.Layout />
              <Filter.Content />
            </div>
          </Components.Sidebar>
        )}
        <Components.PostsLayout
          id="posts-feed"
          className={`${getPostsLayoutClass(
            layout
          )} flex-col inline-flex gap-3`}
        >
          <Components.CreateQuickPost largeView={layout === 'wide'} />
          {data &&
            data?.length > 0 &&
            data.map((post) => (
              <Components.Post key={post.details.id} post={post} />
            ))}
          {isLoading && <Components.Skeleton.Simple />}
        </Components.PostsLayout>
        {layout !== 'wide' && (
          <Components.Sidebar className="hidden xl:block">
            <Components.WhoFollow />
            <Components.Pioneers />
            <Components.HotTags />
            <Components.Feedback />
          </Components.Sidebar>
        )}
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
      <Components.CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
