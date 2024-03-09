'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../../components';

export default function Content() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: 'all',
    iconLabel: <Icon.Stack />,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
    >
      <DropDownUI.Content
        title="Content"
        subtitle="Filter by content type"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="All"
          value="all"
          selected={dropdownValue.value === 'all'}
          icon={<Icon.Stack />}
          onClick={() => {
            setDropdownValue({
              value: 'all',
              iconLabel: <Icon.Stack />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Posts"
          value="posts"
          selected={dropdownValue.value === 'posts'}
          icon={<Icon.NoteBlank />}
          onClick={() => {
            setDropdownValue({
              value: 'posts',
              iconLabel: <Icon.NoteBlank />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Images"
          value="images"
          selected={dropdownValue.value === 'Images'}
          icon={<Icon.ImageSquare />}
          onClick={() => {
            setDropdownValue({
              value: 'Images',
              iconLabel: <Icon.ImageSquare />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Videos"
          value="videos"
          selected={dropdownValue.value === 'videos'}
          icon={<Icon.Play />}
          onClick={() => {
            setDropdownValue({
              value: 'videos',
              iconLabel: <Icon.Play />,
            });
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Links"
          value="links"
          selected={dropdownValue.value === 'links'}
          icon={<Icon.LinkSimple />}
          onClick={() => {
            setDropdownValue({
              value: 'links',
              iconLabel: <Icon.LinkSimple />,
            });
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
