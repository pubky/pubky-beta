'use client';

import { BottomSheet, Icon, Typography } from '@social/ui-shared';
import { useState } from 'react';
import ContentType from '../DropDown/_Content/_Content';
import { TContent } from '@/types';

interface ContentProps {
  content: TContent;
  setContent: (content: TContent) => void;
  title?: string;
  className?: string;
}

const icons = {
  all: <Icon.Stack />,
  posts: <Icon.NoteBlank />,
  articles: <Icon.Newspaper />,
  images: <Icon.ImageSquare />,
  videos: <Icon.Play />,
  links: <Icon.LinkSimple />,
  files: <Icon.DownloadSimple />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

export default function Content({ content, setContent, title, className }: ContentProps) {
  const [show, setShow] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: content || 'all',
    textOption: content?.charAt(0).toUpperCase() + content?.slice(1) || 'All',
    iconOption: icons[content] || icons.all
  });

  return (
    <>
      <Typography.Body
        className="flex items-center cursor-pointer text-xl font-light font-InterTight leading-7 tracking-wide"
        variant="medium"
        onClick={() => setShow(true)}
      >
        <span className="mr-1">{dropdownValue.iconOption}</span> {dropdownValue.textOption}
        <div className={`ml-1 transition ease duration-300 ${show ? 'rotate-180' : 'rotate-0'}`}>
          <Icon.DropdownIcon />
        </div>
      </Typography.Body>
      <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
        <ContentType
          content={content}
          setContent={setContent}
          setDropdownValue={setDropdownValue}
          setOpenDropdown={setShow}
        />
      </BottomSheet.Root>
    </>
  );
}
