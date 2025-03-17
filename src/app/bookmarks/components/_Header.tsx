'use client';

import * as Components from '@/components';
import Filter from '@/components/Filter';
import { Icon, Menu } from '@social/ui-shared';
import { useState } from 'react';

export function Header() {
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);

  return (
    <>
      <Components.Header title="Bookmarks" />
      <Components.HeaderMobile
        leftIcon={
          <div className="cursor-pointer" onClick={() => setDrawerFilterOpen(true)}>
            <Icon.SlidersHorizontal size="24" />
          </div>
        }
      >
        <Menu.Root
          position="left"
          drawerOpen={drawerFilterOpen}
          setDrawerOpen={setDrawerFilterOpen}
          className="w-[70%] border-r border-white"
        >
          <div className="overflow-y-auto max-h-full no-scrollbar">
            <Filter.Sort />
            <Filter.Content />
          </div>
        </Menu.Root>
      </Components.HeaderMobile>
    </>
  );
}
