'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Header as HeaderUI, Input, Icon, Button, PostUtil } from '@social/ui-shared';
import { useFilterContext, usePubkyClientContext, useModal } from '@/contexts';
import { ImageByUri } from '../ImageByUri';
import { usePathname, useRouter } from 'next/navigation';
import Modal from '../Modal';
import { Utils } from '@social/utils-shared';
import { searchTagsByPrefix, searchUsersById, searchUsersByName } from '@/services/streamService';
import { UserView } from '@/types/User';
import { getUserProfile } from '@/services/userService';

interface HeaderProps {
  title?: React.ReactNode;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { pubky, isLoggedIn, setSearchTags, searchTags } = usePubkyClientContext();
  const { unReadNotification } = useFilterContext();
  const { openModal } = useModal();

  const [isOpenCard, setIsOpenCard] = useState(false);
  const [logoLink, setLogoLink] = useState('/onboarding');
  const [inputValue, setInputValue] = useState('');
  const [tagsWidth, setTagsWidth] = useState(0);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);

  const refSearchInputCard = useRef<HTMLDivElement>(null);
  const refTagsContainer = useRef<HTMLDivElement>(null);

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
      if (refSearchInputCard.current && !refSearchInputCard.current.contains(event.target as Node)) {
        setIsOpenCard(false);
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

  useEffect(() => {
    if (refTagsContainer.current) {
      const width = refTagsContainer.current.offsetWidth;
      setTagsWidth(width);
    }
  }, [searchTags]);

  useEffect(() => {
    if (!isOpenCard || !inputValue.trim()) {
      setSearchedUsers([]);
      setSearchedTags([]);
      setSelectedUserIndex(null);
      return;
    }
    let isActive = true;

    // Fetch users independently
    const fetchUsers = async () => {
      try {
        const searchValue = inputValue.trim().startsWith('pk:') ? inputValue.trim().substring(3) : inputValue.trim();
        const resultById = searchValue.length >= 3 ? await searchUsersById(searchValue) : [];
        const resultByName = await searchUsersByName(inputValue.trim());
        const result = Array.from(new Set([...resultById, ...resultByName]));

        if (isActive && result.length > 0) {
          // Remove duplicate strings before fetching profiles
          const uniqueUserIds = Array.from(new Set(result));

          const userProfiles = await Promise.all(
            uniqueUserIds.map(async (userId) => {
              try {
                return await getUserProfile(userId, pubky);
              } catch (error) {
                return null;
              }
            })
          );

          const validUsers = userProfiles.filter((user) => user !== null);
          const uniqueUsers = Array.from(new Map(validUsers.map((user) => [user.details.id, user])).values());
          setSearchedUsers(uniqueUsers);
        } else {
          setSearchedUsers([]);
        }
      } catch (error) {
        if (isActive) {
          setSearchedUsers([]);
        }
      }
    };

    // Fetch tags independently
    const fetchTags = async () => {
      try {
        const tags = await searchTagsByPrefix(inputValue.trim(), 0, 3);
        if (isActive) {
          setSearchedTags(tags || []);
        }
      } catch (error) {
        if (isActive) {
          setSearchedTags([]);
        }
      }
    };

    const timeoutUsers = setTimeout(fetchUsers, 500);
    const timeoutTags = setTimeout(fetchTags, 500);

    return () => {
      isActive = false;
      clearTimeout(timeoutUsers);
      clearTimeout(timeoutTags);
    };
  }, [inputValue, isOpenCard, pubky]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchedUsers.length > 0 && isOpenCard) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedUserIndex((prevIndex) => {
          if (searchedUsers.length === 0) return null;
          let nextIndex: number;
          if (e.key === 'ArrowDown') {
            nextIndex = prevIndex === null || prevIndex === searchedUsers.length - 1 ? 0 : prevIndex + 1;
          } else {
            nextIndex = prevIndex === null || prevIndex === 0 ? searchedUsers.length - 1 : prevIndex - 1;
          }
          return nextIndex;
        });
        return;
      } else if (e.key === 'Enter' && selectedUserIndex !== null) {
        const selectedUser = searchedUsers[selectedUserIndex];
        if (selectedUser) {
          setIsOpenCard(false);
          router.push(`/profile/${selectedUser.details.id}`);
        }
        return;
      }
    }
    if (e.key === 'Enter') {
      handleSearchTag();
    }
  };

  const handleSearchTag = () => {
    const searchHistory = Utils.storage.get('searchHistory') || ([] as any);
    if ((inputValue.startsWith('pk:') && inputValue.length === 55) || inputValue.length === 52) {
      const profileId = inputValue.replace(/^pk:/, '');
      if (profileId) {
        const updatedHistory = [
          { type: 'user', value: profileId },
          ...searchHistory.filter((item: any) => item.value !== profileId)
        ].slice(0, 5);
        Utils.storage.set('searchHistory', JSON.stringify(updatedHistory));
      }
      router.push(`/profile/${profileId}`);
    } else {
      const trimmedValue = inputValue.trim();
      const tags = trimmedValue
        .split(' ')
        .filter((tag) => tag.length > 0)
        .map((tag) => tag.toLowerCase());

      const newTags = tags.filter((tag) => !searchTags.includes(tag));

      if (newTags.length > 0) {
        const updatedTags = [...searchTags, ...newTags].slice(0, 3);
        setSearchTags(updatedTags);
      }

      if (trimmedValue) {
        let updatedHistory = [...searchHistory];

        if (tags.length > 0) {
          tags.forEach((tag) => {
            updatedHistory = [{ type: 'tag', value: tag }, ...updatedHistory.filter((item: any) => item.value !== tag)];
          });
        }

        updatedHistory = updatedHistory.slice(0, 5);
        Utils.storage.set('searchHistory', JSON.stringify(updatedHistory));
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
        <div className="flex">
          <div>
            <HeaderUI.Logo link={logoLink} />
          </div>
          <HeaderUI.Title titleHeader={title} />
        </div>
      </div>
      {pubky ? (
        <div className="w-full flex justify-between gap-6">
          <Input.Search>
            {searchTags && (
              <Input.SearchTags ref={refTagsContainer}>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyDown={inputValue.trim() === '' ? undefined : handleKeyDown}
              maxLength={55}
              placeholder={!searchTags.length ? 'Search' : ''}
              className={`${
                isOpenCard && 'rounded-2xl rounded-b-none border-b-0 bg-gradient-to-b from-[#05050A] to-[#05050A]'
              }`}
              style={{ paddingLeft: `${tagsWidth + 24}px` }}
              onClick={() => setIsOpenCard(true)}
              readOnly={searchTags.length >= 3}
              autoComplete="off"
            />
            <Modal.SearchInputCard
              className={isOpenCard ? 'block' : 'hidden'}
              refCard={refSearchInputCard}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isOpenCard={isOpenCard}
              searchedUsers={searchedUsers}
              searchedTags={searchedTags}
              selectedUserIndex={selectedUserIndex}
              setSelectedUserIndex={setSelectedUserIndex}
              onUserClick={(user: UserView) => {
                setIsOpenCard(false);
                router.push(`/profile/${user.details.id}`);
              }}
            />
            <Input.SearchActions className="hidden lg:flex">
              <div className={inputValue && 'cursor-pointer'} onClick={inputValue ? handleSearchTag : undefined}>
                <Icon.MagnifyingGlass />
              </div>
            </Input.SearchActions>
          </Input.Search>
          <div className="hidden lg:flex gap-3 items-center">
            <Link href="/home">
              <Button.Action
                id="header-home-btn"
                variant="menu"
                label="Home"
                active={title === 'Home'}
                //className={title === 'Home' ? 'border-t border-white' : ''}
                icon={<Icon.House size="24" />}
              />
            </Link>
            <Link href="/hot">
              <Button.Action
                id="header-hot-tags-btn"
                variant="menu"
                label="Hot"
                active={title === `Hot`}
                //className={title === 'Hot' ? 'border-t border-white' : ''}
                icon={<Icon.Fire size="24" />}
              />
            </Link>

            <Link href="/bookmarks">
              <Button.Action
                id="header-bookmarks-btn"
                variant="menu"
                label="Bookmarks"
                active={title === `Bookmarks`}
                //className={title === 'Bookmarks' ? 'border-t border-white' : ''}
                icon={<Icon.BookmarkSimple size="24" />}
              />
            </Link>
            <Link href="/settings">
              <Button.Action
                id="header-settings-btn"
                variant="menu"
                label="Settings"
                active={title === 'Settings'}
                //className={title === 'Settings' ? 'border-t border-white' : ''}
                icon={<Icon.GearSix size="24" />}
              />
            </Link>
            <Link id="header-profile-pic" href="/profile" className="w-[48px] relative">
              {unReadNotification !== 0 && (
                <PostUtil.Counter
                  id="header-notification-counter"
                  textCSS="tracking-tight text-black font-semibold text-[13px]"
                  className="z-20 p-0 w-6 h-6 absolute text-center bottom-0 text-black right-0 bg-[#C8FF00] border-white"
                >
                  {unReadNotification > 21 ? '+21' : unReadNotification}
                </PostUtil.Counter>
              )}
              <ImageByUri
                id={pubky}
                width={48}
                height={48}
                className={`rounded-full w-[48px] h-[48px]`}
                alt="user-pic"
              />
            </Link>
          </div>
        </div>
      ) : (
        <Button.Action
          variant="menu"
          label="Join"
          onClick={() => openModal('join')}
          active={title === 'Join'}
          className={title === 'Join' ? 'border-t border-white' : ''}
          icon={<Icon.User size="24" />}
        />
      )}
    </HeaderUI.Root>
  );
}
