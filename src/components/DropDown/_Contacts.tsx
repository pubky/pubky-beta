'use client';

import { useState, useEffect } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts';

export default function Contacts() {
  const { contacts, setContacts } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    following: <Icon.UsersRight />,
    followers: <Icon.UsersLeft />,
    friends: <Icon.Smiley />,
    loading: <Icon.LoadingSpin className="animate-spin" />
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: contacts ? contacts : 'following',
    iconOption: icons.loading
  });

  useEffect(() => {
    setDropdownValue({
      value: contacts ? contacts : 'following',
      iconOption: contacts ? icons[contacts] : icons.following
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown open={openDropdown} setOpen={setOpenDropdown} value={dropdownValue} labelIcon="Contacts">
      <DropDownUI.Content title="Contacts" subtitle="Filter contacts by" className="right-0" isOpen={openDropdown}>
        <DropDownUI.Item
          label="Following"
          value="following"
          selected={contacts === 'following'}
          icon={<Icon.UsersRight />}
          onClick={() => {
            setDropdownValue({
              value: 'following',
              iconOption: <Icon.UsersRight />
            });
            setContacts('following');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Followers"
          value="followers"
          selected={contacts === 'followers'}
          icon={<Icon.UsersLeft />}
          onClick={() => {
            setDropdownValue({
              value: 'followers',
              iconOption: <Icon.UsersLeft />
            });
            setContacts('followers');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Friends"
          value="friends"
          selected={contacts === 'friends'}
          icon={<Icon.Smiley />}
          onClick={() => {
            setDropdownValue({
              value: 'friends',
              iconOption: <Icon.Smiley />
            });
            setContacts('friends');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
