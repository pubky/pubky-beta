import React from 'react';
import { CheckboxIcon } from './_CheckboxIcon';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../../Typography';

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  checked: boolean;
  disabled?: boolean;
  onCheckChange?: (checked: boolean) => void;
  text?: string;
}

export const Checkbox = ({
  checked,
  disabled = false,
  onCheckChange,
  text,
  ...rest
}: CheckboxProps) => {
  const cssStyles = twMerge(
    'grid w-6 h-6 rounded-md border',
    disabled
      ? 'bg-white bg-opacity-10 border-white border-opacity-10'
      : checked
      ? 'bg-white bg-opacity-30 border-white'
      : 'bg-white bg-opacity-10 border-white border-opacity-30'
  );

  const handleInputChange = () => {
    if (!disabled && onCheckChange) {
      onCheckChange(!checked);
    }
  };

  return (
    <label
      className={twMerge(
        'flex gap-2',
        disabled ? 'cursor-default' : 'cursor-pointer'
      )}
    >
      <span className={cssStyles}>{checked && <CheckboxIcon />}</span>
      <input
        {...rest}
        type="checkbox"
        onChange={handleInputChange}
        checked={checked}
        disabled={disabled}
        className="hidden"
      />
      {text && (
        <Typography.Body variant="medium" className="text-opacity-50">
          {text}
        </Typography.Body>
      )}
    </label>
  );
};
