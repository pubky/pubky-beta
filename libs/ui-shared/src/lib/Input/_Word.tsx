import { twMerge } from 'tailwind-merge';
import React from 'react';

interface WordProps extends React.HTMLAttributes<HTMLInputElement> {
  children?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Word = ({
  children,
  error,
  required,
  disabled,
  ...rest
}: WordProps) => {
  const baseCSS =
    'w-full bg-white bg-opacity-10  px-4 py-3 rounded-lg outline-none text-white placeholder:text-white placeholder:text-opacity-50 placeholder:font-semibold justify-start items-start gap-[5px] inline-flex';

  const errorCSS = `text-red-500 text-sm mt-2`;

  const inputWithErrorStyle = `border border-red-500`;

  return (
    <div className="relative">
      <input
        {...rest}
        required={required}
        className={twMerge(
          baseCSS,
          rest.className,
          error ? inputWithErrorStyle : ''
        )}
        disabled={disabled}
        value={children}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
