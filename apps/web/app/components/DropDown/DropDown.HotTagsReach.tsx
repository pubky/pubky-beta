'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';
import { useFilterContext } from '../../../contexts/filters';

export default function HotTagsReach() {
  const { hotTagsReach, setHotTagsReach } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    following: <Icon.UsersRight />,
    followers: <Icon.UsersLeft />,
    friends: <Icon.Smiley />,
    all: <Icon.Broadcast />,
    loading: <Icon.LoadingSpin className="animate-spin" />,
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: hotTagsReach ? hotTagsReach : 'all',
    iconOption: icons.loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: hotTagsReach ? hotTagsReach : 'all',
      iconOption: hotTagsReach ? icons[hotTagsReach] : icons.all,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Reach"
    >
      <DropDownUI.Content
        title="Reach"
        subtitle="Show hot tags from"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Following"
          value="following"
          selected={hotTagsReach === 'following'}
          icon={<Icon.UsersRight />}
          onClick={() => {
            setDropdownValue({
              value: 'following',
              iconOption: <Icon.UsersRight />,
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
              iconOption: <Icon.UsersLeft />,
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
              iconOption: <Icon.Smiley />,
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
              iconOption: <Icon.Broadcast />,
            });
            setHotTagsReach('all');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
