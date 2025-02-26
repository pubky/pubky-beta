'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import DropDown from '../_DropDown';
import ContentLanguages from './_Content';

const labels = {
  english: 'English',
  spanish: 'Spanish',
  german: 'German',
  french: 'French',
  italian: 'Italian'
};

const flags = {
  english: <Icon.UnitedStates size="24" />,
  spanish: <Icon.Spain size="24" />,
  german: <Icon.Germany size="24" />,
  french: <Icon.France size="24" />,
  italian: <Icon.Italy size="24" />
};

export default function Languages() {
  const [openDropdown, setOpenDropdown] = useState(false);

  const [dropdownValue, setDropdownValue] = useState({
    value: 'english',
    textOption: labels.english,
    iconOption: flags.english
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      type={'text'}
      className={openDropdown ? 'z-20' : ''}
    >
      <DropDownUI.Content isOpen={openDropdown} className="right-0 top-0 px-4 py-2">
        <ContentLanguages
          setOpenDropdown={setOpenDropdown}
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
