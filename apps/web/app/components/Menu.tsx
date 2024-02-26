'use client';

import { Icon, Post, Typography } from '@social/ui-shared';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef } from 'react';

export const Menu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const baseCSS = `fixed top-0 right-0 z-40 w-[385px] h-screen transition-transform p-12 bg-black shadow border-l border-fuchsia-500 border-opacity-30 justify-start items-start`;
  const drawer = drawerOpen ? '' : 'translate-x-full hidden';

  return (
    <div>
      <Image
        width={48}
        height={48}
        className="rounded-full cursor-pointer"
        alt="user-pic"
        src="/images/user.png"
        onClick={toggleDrawer}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="drawer-example"
        className={twMerge(baseCSS, drawer)}
        tabIndex={-1}
        aria-labelledby="drawer-label"
      >
        <div className="w-60 flex-col gap-6 inline-flex">
          <div className="flex-col gap-4 flex">
            <Image
              width={96}
              height={96}
              alt="user-pic"
              src="/images/user.png"
              className="rounded-full"
            />
            <div className="flex-col gap-2 flex">
              <Typography.PageTitle className="font-bold leading-[30px]">
                Satoshi Nakamoto
              </Typography.PageTitle>
              <div className="items-center gap-1 inline-flex">
                <Typography.Label className="text-opacity-50">
                  @1qx7...gkw3
                </Typography.Label>
                <Icon.CheckCircle />
              </div>
            </div>
          </div>
          <div className="flex-col gap-1 inline-flex">
            <div className="py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex">
              <div className="items-center gap-2 flex">
                <Icon.Activity />
                <Typography.Body variant="medium-bold">Streams</Typography.Body>
              </div>
            </div>
            <div className="py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex">
              <div className="items-center gap-2 flex">
                <Icon.Bell />
                <Typography.Body variant="medium-bold">
                  Notifications
                </Typography.Body>
              </div>
              <div>
                <Post.Counter
                  className="border-fuchsia-500 border-opacity-100"
                  counter={5}
                />
              </div>
            </div>
            <div className="py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex">
              <div className="items-center gap-2 flex">
                <Icon.BookmarkSimple />
                <Typography.Body variant="medium-bold">
                  Bookmarks
                </Typography.Body>
              </div>
            </div>
            <div className="py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex">
              <div className="items-center gap-2 flex">
                <Icon.Tag size="24" />
                <Typography.Body variant="medium-bold">
                  Hot Tags
                </Typography.Body>
              </div>
            </div>
            <div className="py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex">
              <div className="items-center gap-2 flex">
                <Icon.Users />
                <Typography.Body variant="medium-bold">Friends</Typography.Body>
              </div>
            </div>
            <div className="py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex">
              <div className="items-center gap-2 flex">
                <Icon.GearSix />
                <Typography.Body variant="medium-bold">
                  Settings
                </Typography.Body>
              </div>
            </div>
            <div className="py-2 shadow border-b border-white border-opacity-10 justify-between inline-flex">
              <div className="items-center gap-2 flex">
                <Icon.UserRectangle />
                <Typography.Body variant="medium-bold">Profile</Typography.Body>
              </div>
            </div>
          </div>
        </div>
      </div>
      {drawerOpen && (
        <div
          className="fixed top-0 left-0 z-30 w-full h-screen bg-black bg-opacity-80"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
};
