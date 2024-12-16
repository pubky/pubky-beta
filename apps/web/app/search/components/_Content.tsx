'use client';

import { useRef, useState } from 'react';
import { Content, Menu } from '@social/ui-shared';
import { ButtonFilters } from '@/components';
import { useFilterContext } from '@/contexts';
import { Filter } from '@/components/Filter';
import { SearchPage } from '.';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { useFilterVisibility } from '@/hooks/useFilterVisibility';

export default function ContentSearch() {
  const { layout } = useFilterContext();
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const { isFilterContentVisible, filterContentRef } = useFilterVisibility();
  const drawerFilterRef = useRef<HTMLDivElement>(null);

  useDrawerClickOutside(drawerFilterRef, () => setDrawerFilterOpen(false));

  return (
    <>
      {layout === 'wide' && (
        <ButtonFilters onClick={() => setDrawerFilterOpen(true)} />
      )}
      <Content.Grid className="flex gap-6">
        {layout !== 'wide' && (
          <SearchPage.LeftSidebar
            isFilterContentVisible={isFilterContentVisible}
            filterContentRef={filterContentRef}
          />
        )}
        <SearchPage.MainContent />
        {layout !== 'wide' && <SearchPage.RightSidebar />}
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
