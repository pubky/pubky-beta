'use client';

import { useEffect, useRef } from 'react';
import { DropDown as DropDownUI } from '@social/ui-shared';

interface DropDownProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: {
    value: string;
    iconLabel?: React.ReactNode;
    label?: string;
  };
  children: React.ReactNode;
  label?: string;
  size?: string;
}

export default function DropDown({
  open,
  setOpen,
  value,
  children,
  label,
  size = 'default',
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
    <DropDownUI.Root {...rest} label={label} reference={dropdownRef}>
      <DropDownUI.Button
        iconLabel={value.iconLabel}
        label={value.label}
        isOpen={open}
        onClick={() => setOpen(!open)}
        size={size || 'default'}
      />
      {children}
    </DropDownUI.Root>
  );
}
