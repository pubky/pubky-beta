'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';
import { useFilterContext } from '../../../contexts/filters';

interface TagsTime {
  type?: 'icon' | 'text';
  subtitle?: string;
}

export default function TagsTimeframe({ type = 'icon', subtitle }: TagsTime) {
  const { timeframe, setTimeframe } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);

  const labels = {
    today: 'Today',
    month: 'This month',
    all: 'All time',
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: timeframe ? timeframe : 'today',
    ...(type === 'icon'
      ? { iconOption: <Icon.Calendar /> }
      : { textOption: timeframe ? labels[timeframe] : labels.today }),
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
      type={type}
      subtitle={subtitle}
    >
      <DropDownUI.Content
        title="Timeframe"
        subtitle="Show hot tags of"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Today"
          value="today"
          selected={timeframe === 'today'}
          icon={<Icon.Asterisk size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'today',
              ...(type === 'icon'
                ? { iconOption: <Icon.Asterisk /> }
                : { textOption: 'Today' }),
            });
            setTimeframe('today');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="This month"
          value="month"
          selected={timeframe === 'month'}
          icon={<Icon.Calendar size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'month',
              ...(type === 'icon'
                ? { iconOption: <Icon.Calendar /> }
                : { textOption: 'This month' }),
            });
            setTimeframe('month');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="All time"
          value="all-time"
          selected={timeframe === 'all'}
          icon={<Icon.Clock size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'all',
              ...(type === 'icon'
                ? { iconOption: <Icon.Clock /> }
                : { textOption: 'All time' }),
            });
            setTimeframe('all');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
