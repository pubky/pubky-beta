'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Header as HeaderUI,
  Input,
  Icon,
  Button,
  PostUtil,
} from '@social/ui-shared';
import {
  useFilterContext,
  usePubkyClientContext,
  useJoinModal,
} from '@/contexts';
import { ImageByUri } from '../ImageByUri';
import { usePathname, useRouter } from 'next/navigation';
import Modal from '../Modal';

interface HeaderProps {
  title?: React.ReactNode;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { pubky, isLoggedIn, setSearchTags, searchTags, profile } =
    usePubkyClientContext();
  const { unReadNotification } = useFilterContext();
  const { openJoinModal } = useJoinModal();

  const [searchInputCard, setSearchInputCard] = useState(false);
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [inputValue, setInputValue] = useState('');

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
    fetchLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky]);

  useEffect(() => {
    const handleClickOutsideDrawer = (event: MouseEvent) => {
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

  useEffect(() => {
    if (pathname !== '/search') {
      setSearchTags([]);
    }
  }, [pathname, setSearchTags]);

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
    <HeaderUI.Root className="justify-between hidden lg:flex">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-4 xl:min-w-[180px]">
          <HeaderUI.Logo link={logoLink} />
          <HeaderUI.Title titleHeader={title} />
        </div>
      </div>
      {pubky ? (
        <div className="w-full flex justify-between gap-6">
          <Input.Search>
            {searchTags && (
              <Input.SearchTags>
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
              onKeyDown={inputValue.trim() === '' ? undefined : handleKeyDown}
              maxLength={55}
              placeholder={!searchTags.length ? 'Search' : ''}
              className={`${
                searchInputCard &&
                'rounded-2xl rounded-b-none border-b-0 bg-gradient-to-b from-[#05050A] to-[#05050A]'
              }`}
              onClick={() => setSearchInputCard(true)}
              readOnly={!!searchTags.length}
            />
            <Modal.SearchInputCard
              className={searchInputCard ? 'block' : 'hidden'}
              refCard={refSearchInputCard}
              inputValue={inputValue}
            />
            <Input.SearchActions className="hidden lg:flex">
              <div
                className={inputValue && 'cursor-pointer'}
                onClick={inputValue ? handleSearchTag : undefined}
              >
                <Icon.MagnifyingGlass />
              </div>
            </Input.SearchActions>
          </Input.Search>
          <div className="hidden lg:flex gap-3 items-center">
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
            <Link href="/hot">
              <Button.Action
                id="header-hot-tags-btn"
                variant="menu"
                label="Hot"
                active={title === `Hot`}
                className={title === 'Hot' ? 'border-t border-white' : ''}
                icon={<Icon.Fire size="24" />}
              />
            </Link>

            <Link href="/bookmarks">
              <Button.Action
                id="header-bookmarks-btn"
                variant="menu"
                label="Bookmarks"
                active={title === `Bookmarks`}
                className={title === 'Bookmarks' ? 'border-t border-white' : ''}
                icon={<Icon.BookmarkSimple size="24" />}
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
                  className="p-0 w-6 h-6 absolute text-center bottom-0 text-black right-0 bg-[#C8FF00] border-white"
                >
                  {unReadNotification > 21 ? '+21' : unReadNotification}
                </PostUtil.Counter>
              )}
              <ImageByUri
                id="header-profile-pic"
                width={48}
                height={48}
                className={`${
                  title === 'Profile' && 'border-t-2 border-white'
                } rounded-full w-[48px] h-[48px]`}
                alt="user-pic"
                uri={String(profile?.image)}
              />
            </Link>
          </div>
        </div>
      ) : (
        <Button.Action
          variant="menu"
          label="Join"
          onClick={openJoinModal}
          active={title === 'Join'}
          className={title === 'Join' ? 'border-t border-white' : ''}
          icon={<Icon.User size="24" />}
        />
      )}
    </HeaderUI.Root>
  );
}
