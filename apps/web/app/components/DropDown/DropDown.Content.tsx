'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';
import { useFilterContext } from '../../../contexts/filters';

export default function Content() {
  const { content, setContent } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    posts: <Icon.NoteBlank />,
    images: <Icon.ImageSquare />,
    videos: <Icon.Play />,
    links: <Icon.LinkSimple />,
    all: <Icon.Stack />,
    loading: <Icon.LoadingSpin />,
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: content ? content : 'all',
    iconOption: icons.loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: content ? content : 'all',
      iconOption: content ? icons[content] : icons.posts,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Content"
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
          selected={content === 'all'}
          icon={<Icon.Stack />}
          onClick={() => {
            setDropdownValue({
              value: 'all',
              iconOption: <Icon.Stack />,
            });
            setContent('all');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Posts"
          value="posts"
          selected={content === 'posts'}
          icon={<Icon.NoteBlank />}
          onClick={() => {
            setDropdownValue({
              value: 'posts',
              iconOption: <Icon.NoteBlank />,
            });
            setContent('posts');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Images"
          value="images"
          selected={content === 'images'}
          icon={<Icon.ImageSquare />}
          onClick={() => {
            setDropdownValue({
              value: 'images',
              iconOption: <Icon.ImageSquare />,
            });
            setContent('images');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Videos"
          value="videos"
          selected={content === 'videos'}
          icon={<Icon.Play />}
          onClick={() => {
            setDropdownValue({
              value: 'videos',
              iconOption: <Icon.Play />,
            });
            setContent('videos');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Links"
          value="links"
          selected={content === 'links'}
          icon={<Icon.LinkSimple />}
          onClick={() => {
            setDropdownValue({
              value: 'links',
              iconOption: <Icon.LinkSimple />,
            });
            setContent('links');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
