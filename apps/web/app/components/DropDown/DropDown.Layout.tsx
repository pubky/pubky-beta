'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';

export default function Layout() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'sidebar',
    iconOption: <Icon.SquareHalf />,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Layout"
    >
      <DropDownUI.Content
        title="Layout"
        subtitle="Switch to a different view"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Sidebar"
          value="sidebar"
          selected={dropdownValue.value === 'sidebar'}
          icon={<Icon.SquareHalf />}
          onClick={() => {
            setDropdownValue({
              value: 'sidebar',
              iconOption: <Icon.SquareHalf />,
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
              iconOption: <Icon.List />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Grid"
          value="grid"
          selected={dropdownValue.value === 'grid'}
          icon={<Icon.DotsNine />}
          onClick={() => {
            setDropdownValue({
              value: 'grid',
              iconOption: <Icon.DotsNine />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Columns"
          value="columns"
          selected={dropdownValue.value === 'columns'}
          icon={<Icon.SquaresFour />}
          onClick={() => {
            setDropdownValue({
              value: 'columns',
              iconOption: <Icon.SquaresFour />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
