'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts';

interface ContactsLayout {
  type?: 'icon' | 'text';
  subtitle?: string;
}

export default function ContactsLayout({ type = 'icon', subtitle }: ContactsLayout) {
  const { contactsLayout, setContactsLayout } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    ranking: <Icon.ListNumbers />,
    list: <Icon.List />,
    loading: <Icon.LoadingSpin className="animate-spin" />
  };

  const labels = {
    ranking: 'Ranking',
    list: 'List'
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: contactsLayout ? contactsLayout : 'list',
    ...(type === 'icon'
      ? { iconOption: icons.loading }
      : { textOption: contactsLayout ? labels[contactsLayout] : labels.list })
  });

  useEffect(() => {
    setDropdownValue({
      value: contactsLayout ? contactsLayout : 'list',
      ...(type === 'icon'
        ? { iconOption: contactsLayout ? icons[contactsLayout] : icons.list }
        : {
            textOption: contactsLayout ? labels[contactsLayout] : labels.list
          })
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Layout"
      type={type}
      subtitle={subtitle}
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
              ...(type === 'icon' ? { iconOption: <Icon.ListNumbers /> } : { textOption: 'Ranking' })
            });
            setContactsLayout('ranking');
            setOpenDropdown(false);
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
              ...(type === 'icon' ? { iconOption: <Icon.List /> } : { textOption: 'List' })
            });
            setContactsLayout('list');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
