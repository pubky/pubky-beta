'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Header as HeaderUI, Input, Icon, Menu } from '@social/ui-shared';
import { Modal } from './Modal';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';
import { minifyText } from '../../libs/textHelper';

interface HeaderProps {
  title: React.ReactNode;
  className?: string;
  tags?: string[];
  children?: React.ReactNode;
}

export default function Header({
  title,
  className,
  tags = [],
  children,
}: HeaderProps) {
  const router = useRouter();
  const { pubky, getProfile, isLoggedIn, setRefreshList, setSearchTags } =
    useClientContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInputCard, setSearchInputCard] = useState(false);
  const [image, setImage] = useState('/images/Userpic.png');
  const [name, setName] = useState('');
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [handler, setHandler] = useState('');
  const [inputValue, setInputValue] = useState('');

  const drawerRef = useRef<HTMLDivElement>(null);
  const refSearchInputCard = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHandler(minifyPubky(pubky));
    async function fetchData() {
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        setLogoLink('/onboarding');
      } else {
        setLogoLink('/home');
      }
    }
    fetchData();
    async function fetchProfile() {
      try {
        const userProfile = await getProfile();

        if (userProfile) {
          setImage(userProfile.image || '/images/Userpic.png');
          setName(userProfile.name || '');
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfile();
  }, [getProfile, isLoggedIn, pubky]);

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

  const handleRemoveTag = (indexToRemove: number) => {
    setSearchTags((prevTags: string[]) => {
      const newTags = [...prevTags];
      newTags.splice(indexToRemove, 1);
      return newTags;
    });
    setRefreshList(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchTag();
    }
  };

  const handleSearchTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue.startsWith('#')) {
      setSearchTags((prevTags) => [...prevTags, trimmedValue.slice(1)]);
      setInputValue('');
      router.push('/search');
    }
  };

  return (
    <HeaderUI.Root>
      <HeaderUI.Logo link={logoLink} />
      <HeaderUI.Title titleHeader={title} className={className} />
      <Input.Search
        defaultValue={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      >
        {tags && (
          <Input.SearchTags className="hidden sm:block">
            {tags.map((tag, index) => (
              <Input.SearchTag
                color="bg-amber-500 bg-opacity-30"
                key={index}
                onClick={() => handleRemoveTag(index)}
                actions={[<Icon.X key={index} />]}
                value={`# ${tag}`}
                className="mr-2"
              />
            ))}
          </Input.SearchTags>
        )}
        <Input.SearchInput
          placeholder="Search"
          className="hidden sm:block"
          onClick={() => setSearchInputCard(true)}
        />
        <Modal.SearchInputCard
          className={searchInputCard ? 'hidden xl:block' : 'hidden'}
          refCard={refSearchInputCard}
        />
        <Input.SearchActions className="hidden sm:flex">
          {tags.length > 0 && <Icon.GridFour />}
          <div className="cursor-pointer" onClick={handleSearchTag}>
            <Icon.MagnifyingGlass />
          </div>
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
              username={minifyText(name)}
              handler={handler}
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
              /> */}
              {/* <Menu.Section
                href="/bookmarks"
                icon={<Icon.BookmarkSimple />}
                text="Bookmarks"
                onClick={() => setDrawerOpen(false)}
              /> */}
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
                href="/settings"
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
                icon={<Icon.UserMinus size="24" />}
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
