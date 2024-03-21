'use client';

import { useEffect, useRef } from 'react';
import { DropDown as DropDownUI } from '@social/ui-shared';

interface DropDownProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: {
    value: string;
    iconOption?: React.ReactNode;
    textOption?: string;
  };
  children: React.ReactNode;
  labelIcon?: string;
  type?: 'icon' | 'text';
}

export default function DropDown({
  open,
  setOpen,
  value,
  children,
  labelIcon,
  type,
  ...rest
}: DropDownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, setOpen]);

  return (
    <DropDownUI.Root {...rest} reference={dropdownRef}>
      {type === 'text' ? (
        <DropDownUI.OptionText
          onClick={() => setOpen(!open)}
          isOpen={open}
          textOption={value.textOption}
        />
      ) : (
        <DropDownUI.Button
          iconOption={value.iconOption}
          labelIcon={labelIcon}
          onClick={() => setOpen(!open)}
        />
      )}
      {children}
    </DropDownUI.Root>
  );
}
