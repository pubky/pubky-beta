import { twMerge } from 'tailwind-merge';
import React from 'react';

interface CursorProps extends React.HTMLAttributes<HTMLInputElement> {
  children?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
}

export const Cursor = ({ children, error, required, maxLength, disabled, placeholder = '', ...rest }: CursorProps) => {
  const baseCSS = `w-full h-24 bg-transparent rounded-[5px] outline-none text-white text-[17px] placeholder:text-white placeholder:text-opacity-30 font-normal font-InterTight leading-snug tracking-wide`;

  const errorCSS = `text-red-500 text-sm`;

  const inputWithErrorStyle = `placeholder:text-red-500`;

  return (
    <div className="relative">
      <input
        {...rest}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        className={twMerge(baseCSS, rest.className, error ? inputWithErrorStyle : '')}
        value={children}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
