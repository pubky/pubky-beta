import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TextProps extends React.HTMLAttributes<HTMLInputElement> {
  action?: React.ReactNode;
  error?: string; // Adicione a propriedade error aqui
  type?:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week';
}

export const Text = ({
  action,
  children = '',
  error,
  type = 'text',
  ...rest
}: TextProps) => {
  const baseCSS = `w-full h-[70px] p-6 bg-white bg-opacity-10 rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.32)_inset] border border-white border-opacity-10 flex-col justify-start items-start inline-flex outline-none text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-InterTight leading-snug tracking-wide`;

  const errorCSS = `text-red-500 text-sm mt-2`;

  return (
    <div className="relative w-full">
      <input
        {...rest}
        type={type}
        className={twMerge(
          baseCSS,
          rest.className,
          error ? 'border-red-500 border-opacity-100' : ''
        )}
      />
      {action && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white">
          {action}
        </div>
      )}
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
