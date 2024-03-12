'use client';

import { useEffect, useRef, useState } from 'react';
import { Header as HeaderUI, Input, Icon, Menu } from '@social/ui-shared';
import SearchInputCard from './Component.SearchInputCard';

type Tag = {
  value: string;
  color: string;
};
interface HeaderProps {
  title: string;
  className?: string;
  tags?: Tag[];
  children?: React.ReactNode;
}

export default function Header({
  title,
  className,
  tags = [],
  children,
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInputCard, setSearchInputCard] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const refSearchInputCard = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }
      if (
        refSearchInputCard.current &&
        !refSearchInputCard.current.contains(event.target as Node)
      ) {
        setSearchInputCard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDrawer);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDrawer);
    };
  }, [drawerRef, refSearchInputCard]);

  return (
    <HeaderUI.Root>
      <HeaderUI.Logo />
      <HeaderUI.Title title={title} className={className} />
      <Input.Search>
        {tags && (
          <Input.SearchTags className="hidden sm:block">
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
        <Input.SearchInput
          placeholder="Search tags"
          className="hidden sm:block"
          onClick={() => setSearchInputCard(true)}
        />
        <SearchInputCard
          className={searchInputCard ? 'hidden xl:block' : 'hidden'}
          refCard={refSearchInputCard}
        />
        <Input.SearchActions className="hidden sm:flex">
          {tags.length > 0 && <Icon.GridFour />}
          <Icon.MagnifyingGlass />
        </Input.SearchActions>
      </Input.Search>
      {children}
      <>
        <div
          className="relative cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu.ImageMenu src="/images/user.png" notifications={5} />
        </div>
        <Menu.Root drawerRef={drawerRef} drawerOpen={drawerOpen}>
          <div className="w-full lg:w-60 flex-col gap-6 inline-flex">
            <Menu.Header
              src="/images/user.png"
              username="Satoshi Nakamoto"
              handler="@1qx7...gkw3"
            />
            <div className="flex-col inline-flex">
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
              <Menu.Section
                href="/contacts"
                icon={<Icon.UsersLeft />}
                text="Contacts"
              />
              <Menu.Section
                href="settings"
                icon={<Icon.GearSix />}
                text="Settings"
              />
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
