'use client';

import * as Components from '@/components';
import Filter from '@/components/Filter';
import { Icon, Menu } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';

export function Header() {
  const [drawerFilterOpen, setDrawerFilterOpen] = useState(false);
  const drawerFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      {
        if (
          drawerFilterRef.current &&
          !drawerFilterRef.current.contains(event.target as Node)
        ) {
          setDrawerFilterOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [drawerFilterRef]);

  return (
    <>
      <Components.Header title="Search" />
      <Components.HeaderMobile
        leftIcon={
          <div
            className="cursor-pointer"
            onClick={() => setDrawerFilterOpen(true)}
          >
            <Icon.SlidersHorizontal size="20" />
          </div>
        }
      >
        <Menu.Root
          position="left"
          drawerRef={drawerFilterRef}
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
      </Components.HeaderMobile>
    </>
  );
}
