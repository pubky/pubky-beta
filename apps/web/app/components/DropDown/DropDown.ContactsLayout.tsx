'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';

export default function ContactsLayout() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'ranking',
    iconLabel: <Icon.ListNumbers />,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
    >
      <DropDownUI.Content
        title="Layout"
        subtitle="Switch to a different view"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Ranking"
          value="ranking"
          selected={dropdownValue.value === 'ranking'}
          icon={<Icon.ListNumbers />}
          onClick={() => {
            setDropdownValue({
              value: 'ranking',
              iconLabel: <Icon.ListNumbers />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="List"
          value="list"
          selected={dropdownValue.value === 'list'}
          icon={<Icon.List />}
          onClick={() => {
            setDropdownValue({
              value: 'list',
              iconLabel: <Icon.List />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
