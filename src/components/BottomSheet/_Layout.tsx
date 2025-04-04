'use client';

import { BottomSheet, Icon, Typography } from '@social/ui-shared';
import ContentLayout from '../DropDown/_Layout/_Content';
import { useState } from 'react';
import { TLayouts } from '@/types';

interface LayoutProps {
  layout: TLayouts;
  setLayout: (layout: TLayouts) => void;
  title?: string;
  className?: string;
}

const icons = {
  columns: <Icon.ThreeColumns />,
  wide: <Icon.List />,
  visual: <Icon.SquaresFour color="gray" />,
  focus: <Icon.Crosshair size="24" color="gray" />,
  loading: <Icon.LoadingSpin className="animate-spin" />
};

export default function Layout({ layout, setLayout, title, className }: LayoutProps) {
  const [show, setShow] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    value: layout || 'columns',
    textOption: layout.charAt(0).toUpperCase() + layout.slice(1) || 'Columns',
    iconOption: icons[layout] || icons.columns
  });

  return (
    <>
      <Typography.Body
        className="flex items-center cursor-pointer text-xl font-light font-InterTight leading-7 tracking-wide"
        variant="medium"
        onClick={() => setShow(true)}
      >
        <span className="mr-1">{dropdownValue.iconOption}</span> {dropdownValue.textOption}
        <div className={`ml-1 transition ease duration-300 ${show ? 'rotate-180' : 'rotate-0'}`}>
          <Icon.DropdownIcon />
        </div>
      </Typography.Body>
      <BottomSheet.Root show={show} setShow={setShow} title={title} className={className}>
        <ContentLayout
          layout={layout}
          setLayout={setLayout}
          setDropdownValue={setDropdownValue}
          setOpenDropdown={setShow}
        />
      </BottomSheet.Root>
    </>
  );
}
