'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';

export default function SortFriends() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'active-this-month',
    iconLabel: <Icon.Calendar />,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
    >
      <DropDownUI.Content
        title="Sort"
        subtitle="Sort your friends by"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Active this month"
          value="active-this-month"
          selected={dropdownValue.value === 'active-this-month'}
          icon={<Icon.Calendar size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'active-this-month',
              iconLabel: <Icon.Calendar size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Active all time"
          value="active-all-time"
          selected={dropdownValue.value === 'active-all-time'}
          icon={<Icon.Clock size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'active-all-time',
              iconLabel: <Icon.Clock size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Name"
          value="name"
          selected={dropdownValue.value === 'name'}
          icon={<Icon.ListBullets size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'name',
              iconLabel: <Icon.ListBullets size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Key"
          value="key"
          selected={dropdownValue.value === 'key'}
          icon={<Icon.Key size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'key',
              iconLabel: <Icon.Key size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
