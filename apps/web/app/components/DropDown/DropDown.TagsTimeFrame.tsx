'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';

interface TagsTime {
  type?: 'icon' | 'text';
}

export default function TagsTimeframe({ type = 'icon' }: TagsTime) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'this-month',
    ...(type === 'icon'
      ? { iconOption: <Icon.Calendar /> }
      : { textOption: 'This month' }),
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
      type={type}
    >
      <DropDownUI.Content
        title="Timeframe"
        subtitle="Show hot tags of"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Today"
          value="today"
          selected={dropdownValue.value === 'today'}
          icon={<Icon.Asterisk size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'today',
              ...(type === 'icon'
                ? { iconOption: <Icon.Asterisk /> }
                : { textOption: 'Today' }),
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="This month"
          value="this-month"
          selected={dropdownValue.value === 'this-month'}
          icon={<Icon.Calendar size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'this-month',
              ...(type === 'icon'
                ? { iconOption: <Icon.Calendar /> }
                : { textOption: 'This month' }),
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="All time"
          value="all-time"
          selected={dropdownValue.value === 'all-time'}
          icon={<Icon.Clock size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'all-time',
              ...(type === 'icon'
                ? { iconOption: <Icon.Clock /> }
                : { textOption: 'All time' }),
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
