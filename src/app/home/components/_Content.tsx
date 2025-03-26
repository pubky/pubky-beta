'use client';

import { useState } from 'react';
import { Content, Menu } from '@social/ui-shared';
import * as Components from '@/components';
import { Filter } from '@/components/Filter';
import { useFilterContext } from '@/contexts';
import { LeftSidebar } from './_LeftSidebar';
import { RightSidebar } from './_RightSidebar';
import { MainContent } from './_MainContent';

export default function ContentHome() {
  const { layout } = useFilterContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(true);

  return (
    <>
      {layout === 'wide' && <Components.ButtonFilters onClick={() => setDrawerFilterOpen(true)} />}
      <Content.Grid className="flex gap-6">
        {layout !== 'wide' && <LeftSidebar />}
        <MainContent layout={layout} loadingFeed={loadingFeed} setLoadingFeed={setLoadingFeed} />
        {layout !== 'wide' && <RightSidebar />}
      </Content.Grid>
      <Menu.Root
        position="left"
        drawerOpen={drawerFilterOpen}
        setDrawerOpen={setDrawerFilterOpen}
        clickableArea={layout === 'wide'}
      >
        <div className="overflow-y-auto max-h-full no-scrollbar">
          <Filter.Reach />
          <Filter.Sort />
          <Filter.Content />
          <Filter.Layout setDrawerFilterOpen={setDrawerFilterOpen} />
        </div>
      </Menu.Root>
    </>
  );
}
