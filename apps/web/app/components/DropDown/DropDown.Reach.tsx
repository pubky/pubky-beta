'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';
import { useFilterContext } from '../../../contexts/filters';
import { useClientContext } from '../../../contexts/client';

export default function Reach() {
  const { setRefreshList } = useClientContext();
  const { reach, setReach } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    following: <Icon.UsersRight />,
    followers: <Icon.UsersLeft />,
    friends: <Icon.Smiley />,
    all: <Icon.Broadcast />,
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: reach ? reach : 'all',
    iconOption: reach ? icons[reach] : icons.all,
  });

  useEffect(() => {
    setRefreshList(true);
  }, [dropdownValue, setRefreshList]);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Reach"
    >
      <DropDownUI.Content
        title="Reach"
        subtitle="Show posts from"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Following"
          value="following"
          selected={reach === 'following'}
          icon={<Icon.UsersRight />}
          onClick={() => {
            setDropdownValue({
              value: 'following',
              iconOption: <Icon.UsersRight />,
            });
            setReach('following');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Followers"
          value="followers"
          selected={reach === 'followers'}
          icon={<Icon.UsersLeft />}
          onClick={() => {
            setDropdownValue({
              value: 'followers',
              iconOption: <Icon.UsersLeft />,
            });
            setReach('followers');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Friends"
          value="friends"
          selected={reach === 'friends'}
          icon={<Icon.Smiley />}
          onClick={() => {
            setDropdownValue({
              value: 'friends',
              iconOption: <Icon.Smiley />,
            });
            setReach('friends');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="All"
          value="all"
          selected={reach === 'all'}
          icon={<Icon.Broadcast />}
          onClick={() => {
            setDropdownValue({
              value: 'all',
              iconOption: <Icon.Broadcast />,
            });
            setReach('all');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
