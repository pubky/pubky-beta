'use client';

import { useState } from 'react';
import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { useFilterContext } from '@/contexts';
import DropDown from '../_DropDown';
import ContentLayout from './_Content';
import { TLayouts } from '@/types';

interface LayoutProps {
  layout: TLayouts;
  setLayout: (layout: TLayouts) => void;
}

export default function Layout({ layout, setLayout }: LayoutProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const icons = {
    columns: <Icon.ThreeColumns />,
    wide: <Icon.List />,
    visual: <Icon.SquaresFour color="gray" />,
    focus: <Icon.Crosshair size="24" color="gray" />,
    loading: <Icon.LoadingSpin className="animate-spin" />
  };
  const [dropdownValue, setDropdownValue] = useState({
    value: layout || 'columns',
    textOption: layout?.charAt(0).toUpperCase() + layout?.slice(1) || 'Columns',
    iconOption: icons[layout] || icons.columns
  });

  return (
    <DropDown
      idPrefix="layout"
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Layout"
      type="text"
    >
      <DropDownUI.Content className="right-0 mt-0 px-4 py-2" isOpen={openDropdown}>
        <ContentLayout
          layout={layout}
          setLayout={setLayout}
          setDropdownValue={setDropdownValue}
          setOpenDropdown={setOpenDropdown}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
