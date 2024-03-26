'use client';

import { useEffect, useRef, useState } from 'react';
import { Header as HeaderUI, Input, Icon, Menu } from '@social/ui-shared';
import { Modal } from './Modal';
import { useClientContext } from '../../contexts/client';
import { minifyPubkey } from '../../libs/profileHelper';

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
  const { pubkey, getProfile, isLoggedIn } = useClientContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInputCard, setSearchInputCard] = useState(false);
  const [image, setImage] = useState('/images/Userpic.png');
  const [name, setName] = useState('');
  const [logoLink, setLogoLink] = useState('/onboarding');

  const drawerRef = useRef<HTMLDivElement>(null);
  const refSearchInputCard = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
    }
    fetchData();
  }, [pubkey, isLoggedIn]);

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getProfile();
        if (profile) {
          setImage(profile?.image || '/images/Userpic.png');
          setName(profile?.name || '');
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubkey, getProfile]);

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
      <HeaderUI.Logo link={logoLink} />
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
        <Modal.SearchInputCard
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
          <Menu.ImageMenu src={image} />
        </div>
        <Menu.Root drawerRef={drawerRef} drawerOpen={drawerOpen}>
          <div className="w-full lg:w-60 flex-col gap-6 inline-flex">
            <Menu.Header
              src={image}
              username={name}
              handler={pubkey ? minifyPubkey(pubkey) : 'Loading...'}
            />
            <div className="flex-col inline-flex">
              <Menu.Section
                href="/home"
                icon={<Icon.Activity />}
                text="Streams"
                onClick={() => setDrawerOpen(false)}
              />
              {/* <Menu.Section
                href="/notifications"
                icon={<Icon.Bell />}
                text="Notifications"
                counter={5}
                onClick={() => setDrawerOpen(false)}
              /> */}
              <Menu.Section
                href="/bookmarks"
                icon={<Icon.BookmarkSimple />}
                text="Bookmarks"
                onClick={() => setDrawerOpen(false)}
              />
              <Menu.Section
                href="/hot-tags"
                icon={<Icon.Tag size="24" />}
                text="Hot Tags"
                onClick={() => setDrawerOpen(false)}
              />
              <Menu.Section
                href="/contacts"
                icon={<Icon.UsersLeft />}
                text="Contacts"
                onClick={() => setDrawerOpen(false)}
              />
              <Menu.Section
                href="settings"
                icon={<Icon.GearSix />}
                text="Settings"
                onClick={() => setDrawerOpen(false)}
              />
              <Menu.Section
                href="/profile"
                icon={<Icon.UserRectangle />}
                text="Profile"
                onClick={() => setDrawerOpen(false)}
              />
              <Menu.Section
                href="/logout"
                icon={<Icon.UsersLeft />}
                text="Logout"
                onClick={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </Menu.Root>
        <Menu.Bg drawerOpen={drawerOpen} />
      </>
    </HeaderUI.Root>
  );
}
