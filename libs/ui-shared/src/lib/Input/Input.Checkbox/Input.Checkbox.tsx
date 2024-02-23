import React from 'react';
import { CheckboxIcon } from './Input.CheckboxIcon';
import { twMerge } from 'tailwind-merge'; // Ensure you've installed tailwind-merge

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  checked: boolean;
  disabled?: boolean;
}

export const Checkbox = ({
  checked,
  disabled = false,
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

  return (
    <label className={twMerge(disabled ? 'cursor-default' : 'cursor-pointer')}>
      <span className={cssStyles}>{checked && <CheckboxIcon />}</span>
      <input
        {...rest}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="hidden"
      />
    </label>
  );
};
