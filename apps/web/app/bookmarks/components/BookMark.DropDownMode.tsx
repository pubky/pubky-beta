'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, DropDown } from '@social/ui-shared';

export default function DropDownMode() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'Sidebar',
    iconLabel: <Icon.SquareHalf />,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <DropDown.Root reference={dropdownRef} className="hidden lg:block">
      <DropDown.Button
        iconLabel={dropdownValue.iconLabel}
        label={dropdownValue.value}
        isOpen={openDropdown}
        onClick={() => setOpenDropdown(!openDropdown)}
      />
      <DropDown.Content
        title="Mode"
        subtitle="Switch to a different view"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDown.Item
          label="Sidebar"
          value="sidebar"
          selected
          icon={<Icon.SquareHalf />}
          iconLabel
          onClick={() => {
            setDropdownValue({
              value: 'sidebar',
              iconLabel: <Icon.SquareHalf />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDown.Item
          label="List"
          value="list"
          selected
          icon={<Icon.List />}
          iconLabel
          onClick={() => {
            setDropdownValue({
              value: 'list',
              iconLabel: <Icon.List />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDown.Item
          label="Grid"
          value="grid"
          selected
          icon={<Icon.DotsNine />}
          iconLabel
          onClick={() => {
            setDropdownValue({
              value: 'grid',
              iconLabel: <Icon.DotsNine />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDown.Item
          label="Columns"
          value="columns"
          selected
          icon={<Icon.SquaresFour />}
          iconLabel
          onClick={() => {
            setDropdownValue({
              value: 'columns',
              iconLabel: <Icon.SquaresFour />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDown.Content>
    </DropDown.Root>
  );
}
