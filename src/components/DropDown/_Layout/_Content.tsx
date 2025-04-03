'use client';

import { Icon, DropDown as DropDownUI } from '@social/ui-shared';
import { TLayouts } from '@/types';

interface ContentLayoutProps {
  layout: TLayouts;
  setLayout: (layout: TLayouts) => void;
  setDropdownValue: any;
  setOpenDropdown: any;
}

const icons = {
  columns: <Icon.ThreeColumns />,
  wide: <Icon.List />,
  visual: <Icon.SquaresFour color="gray" />,
  focus: <Icon.Crosshair size="24" color="gray" />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

export default function ContentLayout({ layout, setLayout, setDropdownValue, setOpenDropdown }: ContentLayoutProps) {
  return (
    <>
      <DropDownUI.Item
        label="Columns"
        value="columns"
        selected={layout === 'columns'}
        icon={icons.columns}
        onClick={() => {
          setDropdownValue({
            value: 'columns',
            textOption: 'Columns',
            iconOption: icons.columns
          });
          setLayout('columns');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Wide"
        value="wide"
        selected={layout === 'wide'}
        icon={icons.wide}
        onClick={() => {
          setDropdownValue({
            value: 'wide',
            textOption: 'Wide',
            iconOption: icons.wide
          });
          setLayout('wide');
          setOpenDropdown(false);
        }}
      />
      <DropDownUI.Item
        label="Visual"
        value="visual"
        selected={layout === 'visual'}
        disabled
        icon={icons.visual}
        //onClick={() => {
        //  setDropdownValue({
        //   value: 'visual',
        //    textOption: 'Visual',
        //    iconOption: icons.visual,
        //  });
        //  setLayout('visual');
        //  setOpenDropdown(false);
        //}}
      />
      <DropDownUI.Item
        label="Focus"
        value="focus"
        selected={layout === 'focus'}
        disabled
        icon={icons.focus}
        //onClick={() => {
        //  setDropdownValue({
        //   value: 'focus',
        //    textOption: 'Focus',
        //    iconOption: icons.focus,
        //  });
        //  setLayout('focus');
        //  setOpenDropdown(false);
        //}}
      />
    </>
  );
}
