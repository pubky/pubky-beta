import React from 'react';
import { CheckboxIcon } from './Input.CheckboxIcon';
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
    'inline-block w-8 h-8 rounded-lg border',
    disabled
      ? 'bg-white bg-opacity-10 border-white border-opacity-10'
      : checked
      ? 'bg-fuchsia-500 bg-opacity-30 border-fuchsia-500'
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
        'flex gap-3',
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
        <Typography.Body variant="medium" className="mt-1 text-opacity-60">
          {text}
        </Typography.Body>
      )}
    </label>
  );
};
