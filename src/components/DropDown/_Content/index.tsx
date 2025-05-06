'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import DropDown from '../_DropDown';
import ContentType from './_Content';
import { TContent } from '@/types';

interface ContentProps {
  content: TContent;
  setContent: (content: TContent) => void;
}

export default function Content({ content, setContent }: ContentProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    all: <Icon.Stack />,
    posts: <Icon.NoteBlank />,
    articles: <Icon.Newspaper />,
    images: <Icon.ImageSquare />,
    videos: <Icon.Play />,
    links: <Icon.LinkSimple />,
    files: <Icon.DownloadSimple size="24" />,
    loading: <Icon.LoadingSpin className="animate-spin" />
  };

  const contentMapping: Record<string, TContent> = {
    long: 'articles',
    short: 'posts',
    image: 'images',
    video: 'videos',
    link: 'links',
    file: 'files'
  };

  const mappedContent = contentMapping[content] || content || 'all';
  const displayContent = mappedContent.charAt(0).toUpperCase() + mappedContent.slice(1);

  const [dropdownValue, setDropdownValue] = useState({
    value: mappedContent,
    textOption: displayContent,
    iconOption: icons[mappedContent] || icons.all
  });

  return (
    <DropDown
      idPrefix="content"
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Content"
      type="text"
    >
      <DropDownUI.Content className="right-0 mt-0 px-4 py-2" isOpen={openDropdown}>
        <ContentType
          content={content}
          setContent={setContent}
          setDropdownValue={setDropdownValue}
          setOpenDropdown={setOpenDropdown}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
