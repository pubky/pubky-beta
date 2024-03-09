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
      ? { iconLabel: <Icon.Calendar /> }
      : { label: 'This month' }),
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      size="small"
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
                ? { iconLabel: <Icon.Asterisk /> }
                : { label: 'Today' }),
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
                ? { iconLabel: <Icon.Calendar /> }
                : { label: 'This month' }),
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
                ? { iconLabel: <Icon.Clock /> }
                : { label: 'All time' }),
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
