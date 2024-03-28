import { twMerge } from 'tailwind-merge';
import React from 'react';

interface CursorAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  children?: string;
  error?: string;
}

export const CursorArea = ({ children, error, ...rest }: CursorAreaProps) => {
  const baseCSS = `w-full h-24 bg-transparent rounded-[5px] outline-none text-white text-[17px] placeholder:text-white placeholder:text-opacity-30 font-normal font-InterTight leading-snug tracking-wide resize-none`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  const inputWithErrorStyle = `border border-red-500`;

  return (
    <div className="relative">
      <textarea
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
