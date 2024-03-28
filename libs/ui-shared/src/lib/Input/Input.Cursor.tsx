import { twMerge } from 'tailwind-merge';
import React from 'react';

interface CursorProps extends React.HTMLAttributes<HTMLInputElement> {
  children?: string;
  error?: string;
}

export const Cursor = ({ children, error, ...rest }: CursorProps) => {
  const baseCSS = `w-full h-24 bg-transparent rounded-[5px] outline-none text-white text-[17px] placeholder:text-white placeholder:text-opacity-30 font-normal font-InterTight leading-snug tracking-wide`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  const inputWithErrorStyle = `border border-red-500`;

  return (
    <div className="relative">
      <input
        {...rest}
        className={twMerge(
          baseCSS,
          rest.className,
          error ? inputWithErrorStyle : ''
        )}
        value={children}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
