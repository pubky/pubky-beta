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

// interface MainContentProps {
//   layout: TLayouts;
// }

export function MainContent() {
  const { searchTags, setSearchTags } = usePubkyClientContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isOpenCard, setIsOpenCard] = useState(false);
  const refSearchInputCard = useRef<HTMLDivElement>(null);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const lastScrollY = useRef(0);

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
      const tags = trimmedValue.split(' ').filter((tag) => tag.length > 0);

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
    const search = searchParams.get('tags');

    if (search) {
      const tagsArray = search.split(',');
      setSearchTags(tagsArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const searchTagsString = searchTags.join(',');
    const searchUrl = searchTagsString ? `/search?tags=${searchTagsString}` : '/search';
    router.replace(searchUrl);
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

  return (
    <Components.PostsLayout className="w-full flex-col inline-flex gap-3">
      <div
        className={`lg:hidden lg:hidden sticky top-20 z-10 transition-transform duration-300 ${
          isSearchBarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            maxLength={55}
            onKeyDown={inputValue.trim() === '' ? undefined : handleKeyDown}
            className={`${
              isOpenCard && 'rounded-2xl rounded-b-none border-b-0 bg-gradient-to-b from-[#05050A] to-[#05050A]'
            }`}
            placeholder={!searchTags.length ? 'Search' : ''}
            onClick={() => setIsOpenCard(true)}
            readOnly={!!searchTags.length}
            autoComplete="off"
            autoFocus={searchTags.length === 0}
          />
          <Modal.SearchInputCard
            className={isOpenCard ? 'block lg:hidden' : 'hidden'}
            refCard={refSearchInputCard}
            inputValue={inputValue}
            isOpenCard={isOpenCard}
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
