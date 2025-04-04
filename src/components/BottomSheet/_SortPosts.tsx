'use client';

import { BottomSheet, Icon, Typography } from '@social/ui-shared';
import { useState } from 'react';
import ContentSortPosts from '../DropDown/_SortPosts/_Content';
import { TSort } from '@/types';

interface SortPostsProps {
  sort: TSort;
  setSort: (sort: TSort) => void;
  title?: string;
  className?: string;
}

const icons = {
  recent: <Icon.Asterisk size="24" />,
  popularity: <Icon.Fire size="24" />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

export default function SortPosts({ sort, setSort, title, className }: SortPostsProps) {
  const [show, setShow] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: sort || 'recent',
    textOption: sort?.charAt(0).toUpperCase() + sort?.slice(1) || 'Recent',
    iconOption: icons[sort] || icons.recent
  });

  return (
    <>
      <Typography.Body
        className="flex items-center cursor-pointer text-xl font-light font-InterTight leading-7 tracking-wide"
        variant="medium"
        onClick={() => setShow(true)}
      >
        <span className="mr-1">{dropdownValue.iconOption}</span> {dropdownValue.textOption}
        <div className={`ml-1 transition ease duration-300 ${show ? 'rotate-180' : 'rotate-0'}`}>
          <Icon.DropdownIcon />
        </div>
      </Typography.Body>
      <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
        <ContentSortPosts sort={sort} setSort={setSort} setDropdownValue={setDropdownValue} setOpenDropdown={setShow} />
      </BottomSheet.Root>
    </>
  );
}
