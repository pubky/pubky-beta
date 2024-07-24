'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';

const labels = {
  english: 'English',
  spanish: 'Spanish',
  german: 'German',
  french: 'French',
  italian: 'Italian',
};

const flags = {
  english: <Icon.UnitedStates size="24" />,
  spanish: <Icon.Spain size="24" />,
  german: <Icon.Germany size="24" />,
  french: <Icon.France size="24" />,
  italian: <Icon.Italy size="24" />,
};

export default function Languages() {
  const [openDropdown, setOpenDropdown] = useState(false);

  const [dropdownValue, setDropdownValue] = useState({
    value: 'english',
    textOption: labels.english,
    iconOption: flags.english,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      type={'text'}
      className={openDropdown ? 'z-20' : ''}
    >
      <DropDownUI.Content isOpen={openDropdown} className="right-0 top-0">
        <DropDownUI.Item
          label="English"
          value="english"
          selected={dropdownValue.value === 'english'}
          icon={<Icon.UnitedStates size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'english',
              textOption: 'English',
              iconOption: <Icon.UnitedStates size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Spanish"
          value="spanish"
          selected={dropdownValue.value === 'spanish'}
          icon={<Icon.Spain size="24" />}
          disabled
          //onClick={() => {
          //  setDropdownValue({
          //   value: 'spanish',
          //   textOption: 'spanish',
          //   iconOption: <Icon.Spain size="24" />,
          // });
          // setOpenDropdown(false);
          //}}
        />
        <DropDownUI.Item
          label="German"
          value="german"
          selected={dropdownValue.value === 'german'}
          icon={<Icon.Germany size="24" />}
          disabled
          //onClick={() => {
          // setDropdownValue({
          //    value: 'german',
          //   textOption: 'german',
          //   iconOption: <Icon.Germany size="24" />,
          // });
          //  setOpenDropdown(false);
          //}}
        />
        <DropDownUI.Item
          label="French"
          value="french"
          selected={dropdownValue.value === 'french'}
          icon={<Icon.France size="24" />}
          disabled
          //onClick={() => {
          //  setDropdownValue({
          //    value: 'french',
          //    textOption: 'french',
          //    iconOption: <Icon.France size="24" />,
          // });
          // setOpenDropdown(false);
          //}}
        />
        <DropDownUI.Item
          label="Italian"
          value="italian"
          selected={dropdownValue.value === 'italian'}
          icon={<Icon.Italy size="24" />}
          disabled
          //onClick={() => {
          //  setDropdownValue({
          //    value: 'italian',
          //    textOption: 'italian',
          //    iconOption: <Icon.Italy size="24" />,
          //  });
          // setOpenDropdown(false);
          //}}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
