'use client';

import { useState } from 'react';
import { Check } from '../Icon/Icon.System';

interface CheckboxProps extends React.HTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
}

export const Checkbox = ({ disabled = false, ...rest }: CheckboxProps) => {
  const [checked, setChecked] = useState(false);

  const toggleCheckBox = () => {
    if (!disabled) {
      setChecked(!checked);
    }
  };

  const cssStyle = `inline-block w-8 h-8 ${
    disabled
      ? 'bg-white bg-opacity-10 border border-white border-opacity-10'
      : checked
      ? 'bg-fuchsia-500 bg-opacity-30 border border-fuchsia-500'
      : 'bg-white bg-opacity-10 border border-white border-opacity-30'
  } rounded-lg`;

  return (
    <div className="flex items-center">
      <label className={`${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={toggleCheckBox}
          className="hidden"
        />
        <span className={cssStyle} {...rest}>
          {checked && (
            <div className="flex items-center justify-center mt-1">
              <Check size="22" />
            </div>
          )}
        </span>
      </label>
    </div>
  );
};
