'use client';

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
import { useFilterContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '../ImageByUri';
import { useRouter } from 'next/navigation';
import Modal from '../Modal';

interface HeaderProps {
  title?: React.ReactNode;
  className?: string;
}

export default function Header({ title, className }: HeaderProps) {
  const router = useRouter();
  const { setSearchTags, searchTags, profile } = usePubkyClientContext();
  const { unReadNotification } = useFilterContext();
  const { pubky, isLoggedIn } = usePubkyClientContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInputCard, setSearchInputCard] = useState(false);
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [handler, setHandler] = useState('');
  const [inputValue, setInputValue] = useState('');

  const drawerRef = useRef<HTMLDivElement>(null);
  const refSearchInputCard = useRef<HTMLDivElement>(null);

  async function fetchLoggedIn() {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      setLogoLink('/onboarding');
    } else {
      setLogoLink('/home');
    }
  }

  useEffect(() => {
    setHandler(Utils.minifyPubky(pubky ?? ''));
    fetchLoggedIn();
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
      if (searchTags.includes(trimmedValue.slice(0))) return;

      if (searchTags.length < 3) {
        setSearchTags([...searchTags, trimmedValue.slice(0)]);
      } else {
        const newSearchTags = [...searchTags.slice(0), trimmedValue.slice(0)];
        setSearchTags(newSearchTags);
      }
      setInputValue('');
      router.push('/search');
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
      <Input.Search>
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
          id="header-search-input"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder={!searchTags.length ? 'Search' : ''}
          className="hidden sm:block"
          onClick={() => setSearchInputCard(true)}
          readOnly={!!searchTags.length}
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
            label="Feed"
            active={title === 'Feed'}
            className={title === 'Feed' ? 'border-t border-white' : ''}
            icon={<Icon.Activity size="24" />}
          />
        </Link>
        <Link href="/hot-tags">
          <Button.Action
            id="header-hot-tags-btn"
            variant="menu"
            label="Hot&#160;Tags"
            active={title === `HotTags`}
            className={title === 'HotTags' ? 'border-t border-white' : ''}
            icon={<Icon.Fire size="24" />}
          />
        </Link>

        <Link href="/influencers">
          <Button.Action
            id="header-nfluencers-btn"
            variant="menu"
            label="Influencers"
            active={title === `Influencers`}
            className={title === 'Influencers' ? 'border-t border-white' : ''}
            icon={<Icon.UsersLeft size="24" />}
          />
        </Link>
        <Link href="/settings">
          <Button.Action
            id="header-settings-btn"
            variant="menu"
            label="Settings"
            active={title === 'Settings'}
            className={title === 'Settings' ? 'border-t border-white' : ''}
            icon={<Icon.GearSix size="24" />}
          />
        </Link>
        <Link href="/profile" className="w-[48px] relative">
          {unReadNotification !== 0 && (
            <PostUtil.Counter
              textCSS="tracking-tight text-black font-semibold text-[13px]"
              className="p-0 w-6 h-6 absolute text-center bottom-0 text-black right-0 bg-white border-white"
            >
              {unReadNotification > 21 ? '+21' : unReadNotification}
            </PostUtil.Counter>
          )}
          <ImageByUri
            id="header-profile-pic"
            width={48}
            height={48}
            className={`${
              title === 'Profile' && 'border-2 border-white'
            } rounded-full w-[48px] h-[48px]`}
            alt="user-pic"
            uri={String(profile?.image)}
          />
        </Link>
      </div>
      <>
        <div
          className="lg:hidden relative cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu.ImageMenu
            uriImage={String(profile?.image ?? '/images/Userpic.png')}
          />
        </div>
        <Menu.Root drawerRef={drawerRef} drawerOpen={drawerOpen}>
          <div className="w-full lg:w-60 flex-col gap-6 inline-flex">
            <Menu.Header
              href="/profile"
              uriImage={String(profile?.image) ?? ''}
              username={profile?.name ? Utils.minifyText(profile?.name) : ''}
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
                counter={unReadNotification}
              />
              <Menu.Section
                href="/influencers"
                icon={<Icon.UsersLeft />}
                text="Influencers"
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
