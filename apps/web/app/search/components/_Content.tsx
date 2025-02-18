'use client';

import { useRef, useState } from 'react';
import { Content, Menu } from '@social/ui-shared';
import { ButtonFilters } from '@/components';
import { useFilterContext } from '@/contexts';
import { Filter } from '@/components/Filter';
import { SearchPage } from '.';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';

export default function ContentSearch() {
  const { layout } = useFilterContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const drawerFilterRef = useRef<HTMLDivElement>(null);

  useDrawerClickOutside(drawerFilterRef, () => setDrawerFilterOpen(false));

  return (
    <>
      {layout === 'wide' && (
        <ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className="flex gap-6">
        {layout !== 'wide' && <SearchPage.LeftSidebar />}
        <SearchPage.MainContent />
        {layout !== 'wide' && <SearchPage.RightSidebar />}
      </Content.Grid>
      <Menu.Root
        position="left"
        drawerRef={drawerFilterRef}
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
