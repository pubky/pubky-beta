'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';

export default function Contacts() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'following',
    iconLabel: <Icon.UsersRight />,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
    >
      <DropDownUI.Content
        title="Contacts"
        subtitle="Filter contacts by"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Following"
          value="following"
          selected={dropdownValue.value === 'following'}
          icon={<Icon.UsersRight />}
          onClick={() => {
            setDropdownValue({
              value: 'following',
              iconLabel: <Icon.UsersRight />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Followers"
          value="followers"
          selected={dropdownValue.value === 'followers'}
          icon={<Icon.UsersLeft />}
          onClick={() => {
            setDropdownValue({
              value: 'followers',
              iconLabel: <Icon.UsersLeft />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Friends"
          value="friends"
          selected={dropdownValue.value === 'friends'}
          icon={<Icon.Smiley />}
          onClick={() => {
            setDropdownValue({
              value: 'friends',
              iconLabel: <Icon.Smiley />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
