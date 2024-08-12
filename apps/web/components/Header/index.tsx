'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Header as HeaderUI,
  Input,
  Icon,
  Button,
  Menu,
  PostUtil,
} from '@social/ui-shared';
import { Modal } from '../Modal';
import { useClientContext, useNotificationsContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '../ImageByUri';

interface HeaderProps {
  title?: React.ReactNode;
  className?: string;
}

export default function Header({ title, className }: HeaderProps) {
  const router = useRouter();
  const { pubky, getProfile, isLoggedIn, setSearchTags, searchTags } =
    useClientContext();
  const { notifications } = useNotificationsContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInputCard, setSearchInputCard] = useState(false);
  const [image, setImage] = useState('/images/Userpic.png');
  const [name, setName] = useState('');
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [handler, setHandler] = useState('');
  const [inputValue, setInputValue] = useState('');

  const drawerRef = useRef<HTMLDivElement>(null);
  const refSearchInputCard = useRef<HTMLDivElement>(null);

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

  async function fetchLoggedIn() {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      setLogoLink('/onboarding');
    } else {
      setLogoLink('/home');
    }
  }

  useEffect(() => {
    setHandler(Utils.minifyPubky(pubky));
    fetchLoggedIn();
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
      {
        if (
          drawerRef.current &&
          !drawerRef.current.contains(event.target as Node)
        ) {
          setDrawerOpen(false);
        }
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
    if (
      (inputValue.startsWith('pk:') && inputValue.length === 55) ||
      inputValue.length === 52
    ) {
      const profileId = inputValue.replace(/^pk:/, '');
      router.push(`/profile/${profileId}`);
    } else {
      const trimmedValue = inputValue.trim();
      //if (trimmedValue.startsWith('#')) {
      if (searchTags.includes(trimmedValue.slice(0))) return;

      if (searchTags.length < 3) {
        setSearchTags([...searchTags, trimmedValue.slice(0)]);
      } else {
        const newSearchTags = [...searchTags.slice(0), trimmedValue.slice(0)];
        setSearchTags(newSearchTags);
      }
      setInputValue('');
      router.push('/search');
      // }
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = [...searchTags];
    newTags.splice(indexToRemove, 1);
    setSearchTags(newTags);
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
        {searchTags && (
          <Input.SearchTags className="hidden sm:block">
            {searchTags.map((searchTag, index) => (
              <Input.SearchTag
                key={index}
                onClick={() => handleRemoveTag(index)}
                action={
                  <div className="mt-[3px]">
                    <Icon.X key={index} />
                  </div>
                }
                value={`${searchTag}`}
                className="mr-2"
              />
            ))}
          </Input.SearchTags>
        )}
        <Input.SearchInput
          placeholder={!searchTags.length ? 'Search' : ''}
          className="hidden sm:block"
          onClick={() => setSearchInputCard(true)}
          disabled={!!searchTags.length}
        />
        <Modal.SearchInputCard
          className={searchInputCard ? 'hidden xl:block' : 'hidden'}
          refCard={refSearchInputCard}
          inputValue={inputValue}
        />
        <Input.SearchActions className="hidden sm:flex">
          <div
            className={inputValue && 'cursor-pointer'}
            onClick={inputValue ? handleSearchTag : undefined}
          >
            <Icon.MagnifyingGlass />
          </div>
        </Input.SearchActions>
      </Input.Search>
      <div className="hidden lg:flex gap-4 items-center">
        <Link href="/home">
          <Button.Action
            id="header-home-btn"
            variant="menu"
            //label="Feed"
            active={title === 'Feed'}
            icon={<Icon.Activity size="24" />}
          />
        </Link>
        <Link href="/hot-tags">
          <Button.Action
            id="header-hot-tags-btn"
            variant="menu"
            label="Hot&#160;Tags"
            active={title === `HotTags`}
            icon={<Icon.Tag size="24" />}
          />
        </Link>
        <Link href="/bookmarks">
          <Button.Action
            id="header-bookmarks-btn"
            variant="menu"
            label="Bookmarks"
            active={title === 'Bookmarks'}
            icon={<Icon.BookmarkSimple size="24" />}
          />
        </Link>
        <Link href="/settings">
          <Button.Action
            id="header-settings-btn"
            variant="menu"
            label="Settings"
            active={title === 'Settings'}
            icon={<Icon.GearSix size="24" />}
          />
        </Link>
        <Link href="/profile" className="w-[48px] relative">
          {notifications.length !== 0 && (
            <PostUtil.Counter className="w-6 h-6 absolute text-center bottom-0 right-0 bg-black bg-opacity-60 border-fuchsia-500 border-opacity-100">
              {notifications.length}
            </PostUtil.Counter>
          )}
          <ImageByUri
            id="header-profile-pic"
            width={48}
            height={48}
            className={`rounded-full w-[48px] h-[48px]`}
            alt="user-pic"
            uri={image}
          />
        </Link>
      </div>
      <>
        <div
          className="lg:hidden relative cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu.ImageMenu uriImage={image} />
        </div>
        <Menu.Root drawerRef={drawerRef} drawerOpen={drawerOpen}>
          <div className="w-full lg:w-60 flex-col gap-6 inline-flex">
            <Menu.Header
              href="/profile"
              uriImage={image}
              username={Utils.minifyText(name)}
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
                counter={notifications.length}
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
