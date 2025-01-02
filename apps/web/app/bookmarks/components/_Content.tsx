'use client';

import { useState, useRef } from 'react';
import { Content, Menu } from '@social/ui-shared';
import * as Components from '@/components';
import { Filter } from '@/components/Filter';
import { useFilterContext } from '@/contexts';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { LeftSidebar } from './_LeftSidebar';
import { RightSidebar } from './_RightSidebar';
import { BookmarksPage } from '.';

export default function ContentBookmarks() {
  const { layout } = useFilterContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const drawerFilterRef = useRef<HTMLDivElement>(null);

  useDrawerClickOutside(drawerFilterRef, () => setDrawerFilterOpen(false));

  return (
    <>
      {layout === 'wide' && (
        <Components.ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className="flex gap-6">
        {layout !== 'wide' && <LeftSidebar />}
        <Components.PostsLayout className="w-full flex-col inline-flex gap-3">
          <Components.PostsLayout
            id="posts-feed"
            className="w-full flex-col inline-flex gap-3"
          >
            <BookmarksPage.Timeline />
          </Components.PostsLayout>
        </Components.PostsLayout>
        {layout !== 'wide' && <RightSidebar />}
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
    </>
  );
}
