'use client';

import { useEffect, useRef, useState } from 'react';
import { DropDown } from '@social/ui-shared';

export default function DropDownSort() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'this-week',
    label: 'This week',
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
        label={dropdownValue.label}
        isOpen={openDropdown}
        onClick={() => setOpenDropdown(!openDropdown)}
        size="small"
      />
      <DropDown.Content
        title="Sort"
        subtitle="Sort tags by"
        isOpen={openDropdown}
        className="right-0"
      >
        <DropDown.Item
          label="This week"
          value="this-week"
          selected={dropdownValue.value === 'this-week'}
          onClick={() => {
            setDropdownValue({
              value: 'this-week',
              label: 'This week',
            });
            setOpenDropdown(false);
          }}
        />
        <DropDown.Item
          label="Today"
          value="today"
          selected={dropdownValue.value === 'today'}
          onClick={() => {
            setDropdownValue({
              value: 'today',
              label: 'Today',
            });
            setOpenDropdown(false);
          }}
        />
      </DropDown.Content>
    </DropDown.Root>
  );
}
