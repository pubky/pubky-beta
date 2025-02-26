'use client';

import { useState, useEffect } from 'react';
import { Content, Menu } from '@social/ui-shared';
import * as Components from '@/components';
import { Filter } from '@/components/Filter';
import { useFilterContext, useToastContext } from '@/contexts';
import { LeftSidebar } from './_LeftSidebar';
import { RightSidebar } from './_RightSidebar';
import { BookmarksPage } from '.';

export default function ContentBookmarks() {
  const { layout } = useFilterContext();
  const { addToast } = useToastContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);

  useEffect(() => {
    addToast(
      `Please be aware your bookmarks are stored in a public file connected to your pubky.`,
      'warning',
      'Your bookmarks are public'
    );
  }, []);

  return (
    <>
      {layout === 'wide' && <Components.ButtonFilters onClick={() => setDrawerFilterOpen(true)} />}
      <Content.Grid className="flex gap-6">
        {layout !== 'wide' && <LeftSidebar />}
        <Components.PostsLayout className="w-full flex-col inline-flex gap-3">
          <Components.PostsLayout id="bookmarked-posts" className="w-full flex-col inline-flex gap-3">
            <BookmarksPage.Timeline />
          </Components.PostsLayout>
        </Components.PostsLayout>
        {layout !== 'wide' && <RightSidebar />}
      </Content.Grid>
      <Menu.Root
        position="left"
        drawerOpen={drawerFilterOpen}
        setDrawerOpen={setDrawerFilterOpen}
        clickableArea={layout === 'wide'}
      >
        <div className="overflow-y-auto max-h-full no-scrollbar">
          <Filter.Sort />
          <Filter.Content />
          <Filter.Layout setDrawerFilterOpen={setDrawerFilterOpen} />
        </div>
      </Menu.Root>
    </>
  );
}
