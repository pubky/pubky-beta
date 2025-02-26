'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts';

interface TagsReach {
  type?: 'icon' | 'text';
  subtitle?: string;
}

export default function HotTagsReach({ type = 'icon', subtitle }: TagsReach) {
  const { hotTagsReach, setHotTagsReach } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    following: <Icon.UsersRight />,
    followers: <Icon.UsersLeft />,
    friends: <Icon.Smiley />,
    all: <Icon.Broadcast />,
    loading: <Icon.LoadingSpin className="animate-spin" />
  };

  const labels = {
    following: 'Following',
    followers: 'Followers',
    friends: 'Friends',
    all: 'All'
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: hotTagsReach ? hotTagsReach : 'all',
    ...(type === 'icon'
      ? { iconOption: icons.loading }
      : { textOption: hotTagsReach ? labels[hotTagsReach] : labels.all })
  });

  useEffect(() => {
    setDropdownValue({
      value: hotTagsReach ? hotTagsReach : 'all',
      ...(type === 'icon'
        ? { iconOption: hotTagsReach ? icons[hotTagsReach] : icons.all }
        : { textOption: hotTagsReach ? labels[hotTagsReach] : labels.all })
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Reach"
      type={type}
      subtitle={subtitle}
    >
      <DropDownUI.Content title="Reach" subtitle="Show hot tags from" isOpen={openDropdown}>
        <DropDownUI.Item
          label="Following"
          value="following"
          selected={hotTagsReach === 'following'}
          icon={<Icon.UsersRight />}
          onClick={() => {
            setDropdownValue({
              value: 'following',
              ...(type === 'icon' ? { iconOption: <Icon.UsersRight /> } : { textOption: 'Following' })
            });
            setHotTagsReach('following');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Followers"
          value="followers"
          selected={hotTagsReach === 'followers'}
          icon={<Icon.UsersLeft />}
          onClick={() => {
            setDropdownValue({
              value: 'followers',
              ...(type === 'icon' ? { iconOption: <Icon.UsersLeft /> } : { textOption: 'Followers' })
            });
            setHotTagsReach('followers');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Friends"
          value="friends"
          selected={hotTagsReach === 'friends'}
          icon={<Icon.Smiley />}
          onClick={() => {
            setDropdownValue({
              value: 'friends',
              ...(type === 'icon' ? { iconOption: <Icon.Smiley /> } : { textOption: 'Friends' })
            });
            setHotTagsReach('friends');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="All"
          value="all"
          selected={hotTagsReach === 'all'}
          icon={<Icon.Broadcast />}
          onClick={() => {
            setDropdownValue({
              value: 'all',
              ...(type === 'icon' ? { iconOption: <Icon.Broadcast /> } : { textOption: 'All' })
            });
            setHotTagsReach('all');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
