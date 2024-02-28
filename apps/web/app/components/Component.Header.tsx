'use client';

import { useEffect, useRef, useState } from 'react';
import { Header as HeaderUI, Input, Icon, Menu } from '@social/ui-shared';

type Tag = {
  value: string;
  color: string;
};
interface HeaderProps {
  title: string;
  tags?: Tag[];
}

export default function Header({ title, tags = [] }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [drawerRef]);

  return (
    <HeaderUI.Root>
      <HeaderUI.Logo />
      <HeaderUI.Title title={title} />
      <Input.Search className="w-[854px]">
        {tags && (
          <Input.SearchTags>
            {tags.map((tag, index) => (
              <Input.SearchTag
                color={tag.color}
                key={index}
                actions={[<Icon.X key={index} />]}
                value={tag.value}
              />
            ))}
          </Input.SearchTags>
        )}
        <Input.SearchInput />
        <Input.SearchActions>
          {tags.length > 0 && <Icon.GridFour />}
          <Icon.MagnifyingGlass />
        </Input.SearchActions>
      </Input.Search>
      <>
        <div
          className="relative cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu.ImageMenu src="/images/user.png" notifications={5} />
        </div>
        <Menu.Root drawerRef={drawerRef} drawerOpen={drawerOpen}>
          <div className="w-60 flex-col gap-6 inline-flex">
            <Menu.Header
              src="/images/user.png"
              username="Satoshi Nakamoto"
              handler="@1qx7...gkw3"
            />
            <div className="flex-col gap-1 inline-flex">
              <Menu.Section
                href="/home"
                icon={<Icon.Activity />}
                text="Streams"
              />
              <Menu.Section
                href="/notifications"
                icon={<Icon.Bell />}
                text="Notifications"
                counter={5}
              />
              <Menu.Section
                href="/bookmarks"
                icon={<Icon.BookmarkSimple />}
                text="Bookmarks"
              />
              <Menu.Section
                href="/hot-tags"
                icon={<Icon.Tag size="24" />}
                text="Hot Tags"
              />
              <Menu.Section icon={<Icon.Users />} text="Friends" />
              <Menu.Section icon={<Icon.GearSix />} text="Settings" />
              <Menu.Section
                href="/profile"
                icon={<Icon.UserRectangle />}
                text="Profile"
              />
            </div>
          </div>
        </Menu.Root>
        <Menu.Bg drawerOpen={drawerOpen} />
      </>
    </HeaderUI.Root>
  );
}
