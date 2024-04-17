'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';
import { useFilterContext } from '../../../contexts/filters';

export default function SortPosts() {
  const { sort, setSort } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);

  const icons = {
    recent: <Icon.Asterisk size="24" />,
    tags: <Icon.Tag size="24" />,
    activity: <Icon.Fire size="24" />,
    loading: <Icon.LoadingSpin />,
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
          label="Tags"
          value="tags"
          selected={sort === 'tags'}
          icon={<Icon.Tag size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'tags',
              iconOption: <Icon.Tag size="24" />,
            });
            setSort('tags');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Activity"
          value="activity"
          selected={sort === 'activity'}
          icon={<Icon.Fire size="24" />}
          onClick={() => {
            setDropdownValue({
              value: 'activity',
              iconOption: <Icon.Fire size="24" />,
            });
            setSort('activity');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
