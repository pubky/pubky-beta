'use client';

import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface CursorAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  children?: string;
  ref?: React.RefObject<HTMLTextAreaElement>;
  error?: string;
  value?: string;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
}

export const CursorArea = ({
  children,
  ref,
  error,
  value,
  maxLength,
  disabled,
  placeholder = '',
  ...rest
}: CursorAreaProps) => {
  const textareaRef = ref && useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = '25px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const baseCSS = `w-full h-auto min-h-[25px] bg-transparent rounded-[5px] outline-none text-white text-[17px] placeholder:text-white placeholder:text-opacity-30 font-normal font-InterTight leading-snug tracking-wide resize-none`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  const inputWithErrorStyle = `border border-red-500`;

  return (
    <div className="relative w-full">
      <textarea
        {...rest}
        ref={textareaRef}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        className={twMerge(baseCSS, rest.className, error ? inputWithErrorStyle : '')}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
