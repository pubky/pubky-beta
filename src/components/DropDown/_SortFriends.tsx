'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';

interface SortFriends {
  type?: 'icon' | 'text';
  subtitle?: string;
  disabled?: boolean;
}

export default function SortFriends({ type = 'icon', subtitle, disabled = false }: SortFriends) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const labels = {
    activeThisMonth: 'Active this month',
    activeAllTime: 'Active all time',
    name: 'Name',
    key: 'Key'
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: 'active-this-month',
    ...(type === 'icon' ? { iconOption: <Icon.Calendar /> } : { textOption: labels.activeThisMonth })
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
      type={type}
      subtitle={subtitle}
      disabled={disabled}
    >
      <DropDownUI.Content title="Sort" subtitle="Sort your friends by" isOpen={openDropdown}>
        <DropDownUI.Item
          label="Active this month"
          value="active-this-month"
          selected={dropdownValue.value === 'active-this-month'}
          icon={<Icon.Calendar size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'active-this-month',
              ...(type === 'icon' ? { iconOption: <Icon.Calendar size="24" /> } : { textOption: 'Active this month' })
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
              ...(type === 'icon' ? { iconOption: <Icon.Clock size="24" /> } : { textOption: 'Active all time' })
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
              ...(type === 'icon' ? { iconOption: <Icon.ListBullets size="24" /> } : { textOption: 'Name' })
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
              ...(type === 'icon' ? { iconOption: <Icon.Key size="24" /> } : { textOption: 'Key' })
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
