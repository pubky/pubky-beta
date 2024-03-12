'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';

export default function SortPosts() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'recent',
    iconLabel: <Icon.Asterisk />,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
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
              iconLabel: <Icon.Asterisk size="24" />,
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
              iconLabel: <Icon.Tag size="24" />,
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
              iconLabel: <Icon.Fire size="24" />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
