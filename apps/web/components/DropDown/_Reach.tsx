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
          value="Following"
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
          label="Friends"
          value="Friends"
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
          value="All"
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
