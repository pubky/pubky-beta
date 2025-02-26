import { twMerge } from 'tailwind-merge';
import React from 'react';

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  maxLength?: number;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
}

export const TextArea = ({ error, maxLength, disabled = false, value, placeholder, ...rest }: TextAreaProps) => {
  const baseCSS = `scrollbar-thin scrollbar-webkit w-full h-[70px] bg-transparent flex-col justify-start items-start inline-flex outline-none text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-InterTight leading-snug tracking-wide resize-none`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  const inputWithErrorStyle = `border border-red-500`;

  return (
    <div className="relative">
      <textarea
        {...rest}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={twMerge(baseCSS, rest.className, error ? inputWithErrorStyle : '')}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
