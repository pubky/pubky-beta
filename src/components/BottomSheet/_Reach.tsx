'use client';

import { BottomSheet, Icon, Typography } from '@social/ui-shared';
import { useState } from 'react';
import ContentReach from '../DropDown/_Reach/_Content';
import { TReach } from '@/types';

interface ReachProps {
  reach: TReach;
  setReach: (reach: TReach) => void;
  title?: string;
  className?: string;
}

const icons = {
  following: <Icon.UsersRight />,
  followers: <Icon.UsersLeft />,
  friends: <Icon.Smiley />,
  all: <Icon.Broadcast />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

export default function Reach({ reach, setReach, title, className }: ReachProps) {
  const [show, setShow] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: reach || 'all',
    textOption: reach?.charAt(0).toUpperCase() + reach?.slice(1) || 'All',
    iconOption: icons[reach] || icons.all
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
        <ContentReach reach={reach} setReach={setReach} setDropdownValue={setDropdownValue} setOpenDropdown={setShow} />
      </BottomSheet.Root>
    </>
  );
}
