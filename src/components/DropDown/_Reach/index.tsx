'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import DropDown from '../_DropDown';
import ContentReach from './_Content';
import { TReach } from '@/types';

interface ReachProps {
  reach: TReach;
  setReach: (reach: TReach) => void;
}

export default function Reach({ reach, setReach }: ReachProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    following: <Icon.UsersRight />,
    followers: <Icon.UsersLeft />,
    friends: <Icon.Smiley />,
    all: <Icon.Broadcast />,
    loading: <Icon.LoadingSpin className="animate-spin" />
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: reach || 'all',
    textOption: reach?.charAt(0).toUpperCase() + reach?.slice(1) || 'All',
    iconOption: icons[reach] || icons.all
  });

  return (
    <DropDown
      idPrefix="reach"
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Reach"
      type="text"
    >
      <DropDownUI.Content className="right-0 mt-0 px-4 py-2" isOpen={openDropdown}>
        <ContentReach
          reach={reach}
          setReach={setReach}
          setDropdownValue={setDropdownValue}
          setOpenDropdown={setOpenDropdown}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
