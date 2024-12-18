'use client';

import { usePubkyClientContext } from '@/contexts';
import * as Components from '@/components';
import { Icon, Input } from '@social/ui-shared';
import Modal from '@/components/Modal';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { TLayouts } from '@/types';
import { Timeline } from './_Timeline';

// interface MainContentProps {
//   layout: TLayouts;
// }

export function MainContent() {
  const { searchTags, setSearchTags } = usePubkyClientContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [searchInputCard, setSearchInputCard] = useState(false);
  const refSearchInputCard = useRef<HTMLDivElement>(null);

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
    const searchUrl = searchTagsString
      ? `/search?tags=${searchTagsString}`
      : '/search';
    router.replace(searchUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTags]);

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

  return (
    <Components.PostsLayout className="w-full flex-col inline-flex gap-3">
      <Input.Search className="lg:hidden">
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
          maxLength={55}
          onKeyDown={inputValue.trim() === '' ? undefined : handleKeyDown}
          className={`${
            searchInputCard &&
            'rounded-2xl rounded-b-none border-b-0 bg-gradient-to-b from-[#05050A] to-[#05050A]'
          }`}
          placeholder={!searchTags.length ? 'Search' : ''}
          onClick={() => setSearchInputCard(true)}
          readOnly={!!searchTags.length}
        />
        <Modal.SearchInputCard
          className={searchInputCard ? 'block lg:hidden' : 'hidden'}
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
      <Timeline />
    </Components.PostsLayout>
  );
}
