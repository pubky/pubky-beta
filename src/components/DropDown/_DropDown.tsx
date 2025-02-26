'use client';

import { useEffect, useRef } from 'react';
import { DropDown as DropDownUI } from '@social/ui-shared';

interface DropDownProps extends React.HTMLAttributes<HTMLDivElement> {
  idPrefix?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: {
    value: string;
    iconOption?: React.ReactNode;
    textOption?: string;
    iconText?: string;
  };
  children: React.ReactNode;
  labelIcon?: string;
  type?: 'icon' | 'text';
  subtitle?: string;
  disabled?: boolean;
}

export default function DropDown({
  idPrefix,
  open,
  setOpen,
  value,
  children,
  labelIcon,
  type,
  subtitle,
  disabled = false,
  ...rest
}: DropDownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, setOpen]);

  return (
    <DropDownUI.Root idPrefix={idPrefix} {...rest} reference={dropdownRef}>
      {type === 'text' ? (
        <DropDownUI.OptionText
          onClick={disabled ? undefined : () => setOpen(!open)}
          isOpen={open}
          textOption={value.textOption}
          iconText={value.iconText}
          iconOption={value.iconOption}
          subtitle={subtitle}
          disabled={disabled}
        />
      ) : (
        <DropDownUI.Button
          iconOption={value.iconOption}
          labelIcon={labelIcon}
          onClick={disabled ? undefined : () => setOpen(!open)}
          disabled={disabled}
        />
      )}
      {children}
    </DropDownUI.Root>
  );
}
