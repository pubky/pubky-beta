import React from 'react';
import { twMerge } from 'tailwind-merge';

interface UploadFileProps extends React.HTMLAttributes<HTMLInputElement> {
  error?: string;
  required?: boolean;
}

export const UploadFile = ({
  error,
  required = false,
  ...rest
}: UploadFileProps) => {
  const baseCSS = `cursor-pointer font-InterTight block w-full text-sm text-white text-opacity-30
  file:me-4 file:py-2 file:px-4
  file:rounded-lg file:border-0
  file:text-sm file:font-semibold
  file:bg-fuchsia-500 hover:file:bg-opacity-60 file:text-white file:bg-opacity-30 file:border file:border-fuchsia-500
  file:cursor-pointer
  file:mr-4
  file:font-InterTight
  file:disabled:opacity-50 file:disabled:pointer-events-none`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  return (
    <div className="relative w-full">
      <input
        {...rest}
        type="file"
        required={required}
        className={twMerge(
          baseCSS,
          rest.className,
          error ? 'border-red-500 border-opacity-100' : ''
        )}
      />
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
