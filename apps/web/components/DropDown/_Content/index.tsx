'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import DropDown from '../_DropDown';
import { useFilterContext } from '@/contexts';
import ContentType from './_Content';

export default function Content() {
  const { content } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    all: <Icon.Stack />,
    posts: <Icon.NoteBlank />,
    articles: <Icon.Newspaper />,
    images: <Icon.ImageSquare />,
    videos: <Icon.Play />,
    links: <Icon.LinkSimple />,
    files: <Icon.DownloadSimple />,
    loading: <Icon.LoadingSpin className="animate-spin" />,
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: content || 'all',
    textOption: content?.charAt(0).toUpperCase() + content?.slice(1) || 'All',
    iconOption: icons[content] || icons.all,
  });

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Content"
      type="text"
    >
      <DropDownUI.Content
        className="right-0 mt-0 px-4 py-2"
        isOpen={openDropdown}
      >
        <ContentType
          setDropdownValue={setDropdownValue}
          setOpenDropdown={setOpenDropdown}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
