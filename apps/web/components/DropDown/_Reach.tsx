'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts';

export default function Reach() {
  const { reach, setReach } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    Following: <Icon.UsersRight />,
    Followers: <Icon.UsersLeft />,
    Friends: <Icon.Smiley />,
    All: <Icon.Broadcast />,
    Loading: <Icon.LoadingSpin className="animate-spin" />,
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: reach ? reach : 'all',
    iconOption: icons.Loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: reach ? reach : 'all',
      iconOption: reach ? icons[reach] : icons.All,
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
        subtitle="Show posts from"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Following"
          value="following"
          selected={reach === 'Following'}
          icon={<Icon.UsersRight />}
          onClick={() => {
            setDropdownValue({
              value: 'Following',
              iconOption: <Icon.UsersRight />,
            });
            setReach('Following');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Friends"
          value="friends"
          selected={reach === 'Friends'}
          icon={<Icon.Smiley />}
          onClick={() => {
            setDropdownValue({
              value: 'Friends',
              iconOption: <Icon.Smiley />,
            });
            setReach('Friends');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="All"
          value="all"
          selected={reach === 'All'}
          icon={<Icon.Broadcast />}
          onClick={() => {
            setDropdownValue({
              value: 'All',
              iconOption: <Icon.Broadcast />,
            });
            setReach('All');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
