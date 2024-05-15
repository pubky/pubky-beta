'use client';

import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface CursorAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  children?: string;
  error?: string;
  value?: string;
  maxLength?: number;
}

export const CursorArea = ({
  children,
  error,
  value,
  maxLength,
  ...rest
}: CursorAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const baseCSS = `no-scrollbar w-full h-auto min-h-[25px] bg-transparent rounded-[5px] outline-none text-white text-[17px] placeholder:text-white placeholder:text-opacity-30 font-normal font-InterTight leading-snug tracking-wide resize-none`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  const inputWithErrorStyle = `border border-red-500`;

  return (
    <div className="relative">
      <textarea
        {...rest}
        ref={textareaRef}
        value={value}
        maxLength={maxLength}
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
