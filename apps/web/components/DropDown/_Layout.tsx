'use client';

import { useEffect, useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '..';
import { useFilterContext } from '@/contexts';

export default function Layout() {
  const { layout, setLayout } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    columns: <Icon.ThreeColumns />,
    wide: <Icon.List />,
    map: <Icon.Globe />,
    visual: <Icon.SquaresFour color="gray" />,
    loading: <Icon.LoadingSpin className="animate-spin" />,
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: layout ? layout : 'sidebar',
    iconOption: icons.loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: layout ? layout : 'columns',
      iconOption: layout ? icons[layout] : icons.columns,
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
          label="Columns"
          value="columns"
          selected={layout === 'columns'}
          icon={<Icon.ThreeColumns />}
          onClick={() => {
            setDropdownValue({
              value: 'columns',
              iconOption: <Icon.ThreeColumns />,
            });
            setLayout('columns');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Wide"
          value="wide"
          selected={layout === 'wide'}
          icon={<Icon.List />}
          onClick={() => {
            setDropdownValue({
              value: 'wide',
              iconOption: <Icon.List />,
            });
            setLayout('wide');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Map"
          value="map"
          selected={layout === 'map'}
          icon={<Icon.List />}
          onClick={() => {
            setDropdownValue({
              value: 'map',
              iconOption: <Icon.Globe />,
            });
            setLayout('map');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Visual"
          value="visual"
          selected={layout === 'visual'}
          icon={<Icon.SquaresFour />}
          onClick={() => {
            setDropdownValue({
              value: 'visual',
              iconOption: <Icon.SquaresFour />,
            });
            setLayout('visual');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
