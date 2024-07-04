'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts/filters';

export default function Layout() {
  const { layout, setLayout } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    sidebar: <Icon.SquareHalf />,
    list: <Icon.List />,
    grid: <Icon.DotsNine />,
    columns: <Icon.SquaresFour />,
    loading: <Icon.LoadingSpin className="animate-spin" />,
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: layout ? layout : 'sidebar',
    iconOption: icons.loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: layout ? layout : 'sidebar',
      iconOption: layout ? icons[layout] : icons.sidebar,
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
          label="Sidebar"
          value="sidebar"
          selected={layout === 'sidebar'}
          icon={<Icon.SquareHalf />}
          onClick={() => {
            setDropdownValue({
              value: 'sidebar',
              iconOption: <Icon.SquareHalf />,
            });
            setLayout('sidebar');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="List"
          value="list"
          selected={layout === 'list'}
          icon={<Icon.List />}
          onClick={() => {
            setDropdownValue({
              value: 'list',
              iconOption: <Icon.List />,
            });
            setLayout('list');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Grid"
          value="grid"
          selected={layout === 'grid'}
          icon={<Icon.DotsNine />}
          onClick={() => {
            setDropdownValue({
              value: 'grid',
              iconOption: <Icon.DotsNine />,
            });
            setLayout('grid');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Columns"
          value="columns"
          selected={layout === 'columns'}
          icon={<Icon.SquaresFour />}
          onClick={() => {
            setDropdownValue({
              value: 'columns',
              iconOption: <Icon.SquaresFour />,
            });
            setLayout('columns');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
