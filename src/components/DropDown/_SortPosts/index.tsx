'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import DropDown from '../_DropDown';
import ContentSortPosts from './_Content';
import { TSort } from '@/types';

interface SortPostsProps {
  sort: TSort;
  setSort: (sort: TSort) => void;
}

export default function SortPosts({ sort, setSort }: SortPostsProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const icons = {
    recent: <Icon.Asterisk size="24" />,
    popularity: <Icon.Fire size="24" />,
    loading: <Icon.LoadingSpin className="animate-spin" />
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: sort || 'recent',
    textOption: sort?.charAt(0).toUpperCase() + sort?.slice(1) || 'Recent',
    iconOption: icons[sort] || icons.recent
  });

  return (
    <DropDown
      idPrefix="sort"
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
      type="text"
    >
      <DropDownUI.Content className="right-0 mt-0 px-4 py-2" isOpen={openDropdown}>
        <ContentSortPosts
          sort={sort}
          setSort={setSort}
          setDropdownValue={setDropdownValue}
          setOpenDropdown={setOpenDropdown}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
