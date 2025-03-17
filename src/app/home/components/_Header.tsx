'use client';

import * as Components from '@/components';
import Filter from '@/components/Filter';
import { Icon, Menu } from '@social/ui-shared';
import { useState } from 'react';

export function Header() {
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const [drawerFeedsOpen, setDrawerFeedsOpen] = useState(false);

  return (
    <>
      <Components.Header title="Home" />
      <Components.HeaderMobile
        leftIcon={
          <div className="cursor-pointer" onClick={() => setDrawerFilterOpen(true)}>
            <Icon.SlidersHorizontal size="24" />
          </div>
        }
        rightIcon={
          <div className="cursor-pointer" onClick={() => setDrawerFeedsOpen(true)}>
            <Icon.Activity size="24" />
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
            <Filter.Reach />
            <Filter.Sort />
            <Filter.Content />
          </div>
        </Menu.Root>
        <Menu.Root
          position="right"
          drawerOpen={drawerFeedsOpen}
          setDrawerOpen={setDrawerFeedsOpen}
          className="w-[70%] border-l border-white"
        >
          <div className="overflow-y-auto max-h-full no-scrollbar">
            <Filter.Feeds />
          </div>
        </Menu.Root>
      </Components.HeaderMobile>
    </>
  );
}
