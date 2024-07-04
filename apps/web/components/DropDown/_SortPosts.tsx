'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts';

export default function SortPosts() {
  const { sort, setSort } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);

  const icons = {
    recent: <Icon.Asterisk size="24" />,
    popularity: <Icon.Fire size="24" />,
    loading: <Icon.LoadingSpin className="animate-spin" />,
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: sort ? sort : 'recent',
    iconOption: icons.loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: sort ? sort : 'recent',
      iconOption: sort ? icons[sort] : icons.recent,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
    >
      <DropDownUI.Content
        title="Sort"
        subtitle="Sort posts by"
        className="right-0"
        isOpen={openDropdown}
      >
        <DropDownUI.Item
          label="Recent"
          value="recent"
          selected={sort === 'recent'}
          icon={<Icon.Asterisk size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'recent',
              iconOption: <Icon.Asterisk size="24" />,
            });
            setSort('recent');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Popularity"
          value="popularity"
          selected={sort === 'popularity'}
          icon={<Icon.Fire size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'popularity',
              iconOption: <Icon.Fire size="24" />,
            });
            setSort('popularity');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
