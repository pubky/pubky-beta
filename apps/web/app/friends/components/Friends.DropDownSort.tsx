'use client';

import { useEffect, useRef, useState } from 'react';
import { DropDown } from '@social/ui-shared';

export default function DropDownSort() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'recent',
    label: 'Recent',
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
    <DropDown.Root
      label="Sort by"
      reference={dropdownRef}
      className="hidden lg:block"
    >
      <DropDown.Button
        label={dropdownValue.label}
        isOpen={openDropdown}
        onClick={() => setOpenDropdown(!openDropdown)}
      />
      <DropDown.Content
        title="Sort"
        subtitle="Sort posts by"
        isOpen={openDropdown}
      >
        <DropDown.Item
          label="Recent"
          value="recent"
          selected={dropdownValue.value === 'recent'}
          onClick={() => {
            setDropdownValue({
              value: 'recent',
              label: 'Recent',
            });
            setOpenDropdown(false);
          }}
        />
        <DropDown.Item
          label="Weight"
          value="weight"
          selected={dropdownValue.value === 'weight'}
          onClick={() => {
            setDropdownValue({
              value: 'weight',
              label: 'Weight',
            });
            setOpenDropdown(false);
          }}
        />
        <DropDown.Item
          label="Hotness"
          value="hotness"
          selected={dropdownValue.value === 'hotness'}
          onClick={() => {
            setDropdownValue({
              value: 'hotness',
              label: 'Hotness',
            });
            setOpenDropdown(false);
          }}
        />
        <DropDown.Item
          label="Discovery"
          value="discovery"
          selected={dropdownValue.value === 'discovery'}
          onClick={() => {
            setDropdownValue({
              value: 'discovery',
              label: 'Discovery',
            });
            setOpenDropdown(false);
          }}
        />
      </DropDown.Content>
    </DropDown.Root>
  );
}
