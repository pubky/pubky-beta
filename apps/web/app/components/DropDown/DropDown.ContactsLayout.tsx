'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';
import { useFilterContext } from '../../../contexts/filters';
import { useClientContext } from '../../../contexts/client';

export default function ContactsLayout() {
  const { setRefreshList } = useClientContext();
  const { contactsLayout, setContactsLayout } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    ranking: <Icon.ListNumbers />,
    list: <Icon.List />,
    loading: <Icon.LoadingSpin className="animate-spin" />,
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: contactsLayout ? contactsLayout : 'ranking',
    iconOption: icons.loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: contactsLayout ? contactsLayout : 'ranking',
      iconOption: contactsLayout ? icons[contactsLayout] : icons.ranking,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Layout"
    >
      <DropDownUI.Content
        title="Layout"
        subtitle="Switch to a different view"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Ranking"
          value="ranking"
          selected={contactsLayout === 'ranking'}
          icon={<Icon.ListNumbers />}
          onClick={() => {
            setDropdownValue({
              value: 'ranking',
              iconOption: <Icon.ListNumbers />,
            });
            setContactsLayout('ranking');
            setOpenDropdown(false);
            setRefreshList(true);
          }}
        />
        <DropDownUI.Item
          label="List"
          value="list"
          selected={contactsLayout === 'list'}
          icon={<Icon.List />}
          onClick={() => {
            setDropdownValue({
              value: 'list',
              iconOption: <Icon.List />,
            });
            setContactsLayout('list');
            setOpenDropdown(false);
            setRefreshList(true);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
