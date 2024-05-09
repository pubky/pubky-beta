'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Header as HeaderUI,
  Input,
  Icon,
  //Menu,
  Button,
} from '@social/ui-shared';
import { Modal } from './Modal';
import { useClientContext } from '../../contexts/client';
// import { minifyPubky } from '../../libs/pubkyHelper';
import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  title: React.ReactNode;
  className?: string;
}

export default function Header({ title, className }: HeaderProps) {
  const router = useRouter();
  const { pubky, getProfile, isLoggedIn, setSearchTags, searchTags } =
    useClientContext();

  //const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInputCard, setSearchInputCard] = useState(false);
  const [image, setImage] = useState('/images/Userpic.png');
  //const [name, setName] = useState('');
  const [logoLink, setLogoLink] = useState('/onboarding');
  //const [handler, setHandler] = useState('');
  const [inputValue, setInputValue] = useState('');

  //const drawerRef = useRef<HTMLDivElement>(null);
  const refSearchInputCard = useRef<HTMLDivElement>(null);

  async function fetchProfile() {
    try {
      const userProfile = await getProfile();

      if (userProfile) {
        setImage(userProfile.image || '/images/Userpic.png');
        //setName(userProfile.name || '');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchLoggedIn() {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      setLogoLink('/onboarding');
    } else {
      setLogoLink('/home');
    }
  }

  useEffect(() => {
    //setHandler(minifyPubky(pubky));
    fetchLoggedIn();
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      {
        /** if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }*/
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
  }, [refSearchInputCard]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchTag();
    }
  };

  const handleSearchTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue.startsWith('#')) {
      if (searchTags.includes(trimmedValue.slice(1))) return;

      if (searchTags.length < 3) {
        setSearchTags([...searchTags, trimmedValue.slice(1)]);
      } else {
        const newSearchTags = [...searchTags.slice(1), trimmedValue.slice(1)];
        setSearchTags(newSearchTags);
      }
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        onKeyDown={handleKeyDown}
      >
        {/**{searchTags && (
          <Input.SearchTags className="hidden sm:block">
            {searchTags.map((searchTag, index) => (
              <Input.SearchTag
                color="bg-amber-500 bg-opacity-30"
                key={index}
                onClick={() => handleRemoveTag(index)}
                actions={[<Icon.X key={index} />]}
                value={`# ${searchTag}`}
                className="mr-2"
              />
            ))}
          </Input.SearchTags>
        )}*/}
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
          <div className="cursor-pointer" onClick={handleSearchTag}>
            <Icon.MagnifyingGlass />
          </div>
        </Input.SearchActions>
      </Input.Search>
      <div className="hidden lg:flex gap-4 items-center">
        <Link href="/home">
          <Button.Action
            variant="menu"
            label="Streams"
            active={title === 'Streams'}
            icon={<Icon.Activity size="24" />}
          />
        </Link>
        <Link href="/hot-tags">
          <Button.Action
            variant="menu"
            label="Hot&#160;Tags"
            active={title === `Hot Tags`}
            icon={<Icon.Tag size="24" />}
          />
        </Link>
        <Link href="/contacts">
          <Button.Action
            variant="menu"
            label="Contacts"
            active={title === 'Contacts'}
            icon={<Icon.UsersLeft size="24" />}
          />
        </Link>
        <Link href="/bookmarks">
          <Button.Action
            variant="menu"
            label="Bookmarks"
            active={title === 'Bookmarks'}
            icon={<Icon.BookmarkSimple size="24" />}
          />
        </Link>
        <Link href="/settings">
          <Button.Action
            variant="menu"
            label="Settings"
            active={title === 'Settings'}
            icon={<Icon.GearSix size="24" />}
          />
        </Link>
        <Link href="/profile" className="w-[48px] relative">
          {/* {notifications && (
        <PostUtil.Counter
          className="absolute text-center top-6 right-6 bg-black bg-opacity-60 border-fuchsia-500 border-opacity-100"
          counter={notifications}
        />
      )} */}
          <Image
            width={48}
            height={48}
            className={`rounded-full w-[48px] h-[48px]`}
            alt="user-pic"
            src={image}
          />
        </Link>
      </div>
      {/** 
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
              href="/profile"
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
      */}
    </HeaderUI.Root>
  );
}
