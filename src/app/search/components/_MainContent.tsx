'use client';

import { usePubkyClientContext } from '@/contexts';
import * as Components from '@/components';
import { Icon, Input } from '@social/ui-shared';
import Modal from '@/components/Modal';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { TLayouts } from '@/types';
import { Timeline } from './_Timeline';
import { Utils } from '@social/utils-shared';
import { searchUsersById, searchUsersByName, searchTagsByPrefix } from '@/services/streamService';
import { UserView } from '@/types/User';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getUserProfile } from '@/services/userService';

// interface MainContentProps {
//   layout: TLayouts;
// }

export function MainContent() {
  const { pubky, searchTags, setSearchTags } = usePubkyClientContext();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isOpenCard, setIsOpenCard] = useState(false);
  const [tagsWidth, setTagsWidth] = useState(0);
  const refSearchInputCard = useRef<HTMLDivElement>(null);
  const refTagsContainer = useRef<HTMLDivElement>(null);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [searchedUsers, setSearchedUsers] = useState<UserView[]>([]);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = [...searchTags];
    newTags.splice(indexToRemove, 1);
    setSearchTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    // Extract the full tags parameter from the URL
    const url = window.location.href;
    const tagsRegex = /[?&]tags=([^#]*)/;
    const match = url.match(tagsRegex);
    const search = match ? match[1] : null;

    if (search) {
      const tagsArray = search.split(',').map((tag) => {
        try {
          // First decode the URL, then convert to lowercase
          const result = decodeURIComponent(tag).toLowerCase();
          return result;
        } catch (e) {
          // If decoding fails, return the original tag in lowercase
          return tag.toLowerCase();
        }
      });
      setSearchTags(tagsArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const searchTagsString = searchTags
      .map((tag) => {
        try {
          // Properly encode each tag to handle special characters
          return encodeURIComponent(tag);
        } catch (e) {
          // If encoding fails, return the original tag
          return tag;
        }
      })
      .join(',');

    if (searchTags.length === 0 && !isMobile) {
      router.replace('/home');
    } else if (searchTags.length > 0) {
      const searchUrl = `/search?tags=${searchTagsString}`;
      router.replace(searchUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTags]);

  useEffect(() => {
    if (searchTags.length === 0) {
      setIsOpenCard(true);
    } else {
      setIsOpenCard(false);
    }
  }, [searchTags]);

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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && isSearchBarVisible) {
        setIsSearchBarVisible(false);
      } else if (currentScrollY < lastScrollY.current && !isSearchBarVisible) {
        setIsSearchBarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSearchBarVisible]);

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
  }, [inputValue, isOpenCard]);

  return (
    <Components.PostsLayout className="w-full flex-col inline-flex gap-3">
      <div
        className={`lg:hidden lg:hidden sticky top-20 z-10 transition-transform duration-300 ${
          isSearchBarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
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
            maxLength={55}
            onKeyDown={inputValue.trim() === '' ? undefined : handleKeyDown}
            className={`${
              isOpenCard && 'rounded-2xl rounded-b-none border-b-0 bg-gradient-to-b from-[#05050A] to-[#05050A]'
            }`}
            style={{ paddingLeft: `${tagsWidth + 24}px` }}
            placeholder={!searchTags.length ? 'Search' : ''}
            onClick={() => setIsOpenCard(true)}
            readOnly={searchTags.length >= 3}
            autoComplete="off"
            autoFocus={searchTags.length === 0}
          />
          <Modal.SearchInputCard
            className={isOpenCard ? 'block lg:hidden' : 'hidden'}
            refCard={refSearchInputCard}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isOpenCard={isOpenCard}
            searchedUsers={searchedUsers}
            searchedTags={searchedTags}
            selectedUserIndex={selectedUserIndex}
            setSelectedUserIndex={setSelectedUserIndex}
            onUserClick={(user) => {
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
      </div>
      <Timeline />
    </Components.PostsLayout>
  );
}
