import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Check } from '../Icon/_System';

interface Option {
  label?: string;
  value: string;
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const Radio = ({ value, disabled, options, onChange, ...rest }: RadioProps) => {
  const baseCSS = 'absolute opacity-0 top-0 left-0';
  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className="inline-flex gap-8" role="radiogroup">
      {options.map((option) => (
        <label key={option.value} className="inline-block cursor-pointer" aria-disabled={disabled}>
          <span className="text-white mr-2">{option.label}</span>
          <span className="relative inline-block w-5 h-5">
            <input
              type="radio"
              name={rest.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              className={twMerge(baseCSS, rest.className)}
              disabled={disabled}
              {...rest}
            />
            {value === option.value && <Check />}
          </span>
        </label>
      ))}
    </div>
  );
};
