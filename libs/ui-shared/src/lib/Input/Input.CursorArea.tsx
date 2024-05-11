import { twMerge } from 'tailwind-merge';
import React from 'react';

interface CursorAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  children?: string;
  error?: string;
  value?: string;
}

export const CursorArea = ({
  children,
  error,
  value,
  ...rest
}: CursorAreaProps) => {
  const baseCSS = `w-full h-24 bg-transparent rounded-[5px] outline-none text-white text-[17px] placeholder:text-white placeholder:text-opacity-30 font-normal font-InterTight leading-snug tracking-wide resize-none`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  const inputWithErrorStyle = `border border-red-500`;

  return (
    <div className="relative">
      <textarea
        {...rest}
        value={value}
        className={twMerge(
          baseCSS,
          rest.className,
          error ? inputWithErrorStyle : ''
        )}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
