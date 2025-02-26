'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts';

interface TagsTime {
  type?: 'icon' | 'text';
  subtitle?: string;
  disabled?: boolean;
}

export default function TagsTimeframe({ type = 'icon', subtitle, disabled = false }: TagsTime) {
  const { timeframe, setTimeframe } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);

  const labels = {
    today: 'Today',
    month: 'This month',
    all: 'All time'
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: timeframe ? timeframe : 'today',
    ...(type === 'icon'
      ? { iconOption: <Icon.Calendar /> }
      : { textOption: timeframe ? labels[timeframe] : labels.today })
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
      <DropDownUI.Content title="Timeframe" subtitle="Show hot tags of" isOpen={openDropdown}>
        <DropDownUI.Item
          label="Today"
          value="today"
          selected={timeframe === 'today'}
          icon={<Icon.Asterisk size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'today',
              ...(type === 'icon' ? { iconOption: <Icon.Asterisk /> } : { textOption: 'Today' })
            });
            setTimeframe('today');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="This month"
          value="month"
          selected={timeframe === 'this_month'}
          icon={<Icon.Calendar size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'this_month',
              ...(type === 'icon' ? { iconOption: <Icon.Calendar /> } : { textOption: 'This month' })
            });
            setTimeframe('this_month');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="All time"
          value="all-time"
          selected={timeframe === 'all_time'}
          icon={<Icon.Clock size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'all_time',
              ...(type === 'icon' ? { iconOption: <Icon.Clock /> } : { textOption: 'All time' })
            });
            setTimeframe('all_time');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
