'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';

export default function SortPosts() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'recent',
    iconOption: <Icon.Asterisk />,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
    >
      <DropDownUI.Content
        title="Sort"
        subtitle="Sort posts by"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Recent"
          value="recent"
          selected={dropdownValue.value === 'recent'}
          icon={<Icon.Asterisk size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'recent',
              iconOption: <Icon.Asterisk size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Tags"
          value="tag"
          selected={dropdownValue.value === 'tag'}
          icon={<Icon.Tag size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'tag',
              iconOption: <Icon.Tag size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Activity"
          value="activity"
          selected={dropdownValue.value === 'activity'}
          icon={<Icon.Fire size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'activity',
              iconOption: <Icon.Fire size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
