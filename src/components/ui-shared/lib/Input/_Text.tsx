import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TextProps extends React.HTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
  error?: string;
  required?: boolean;
  value?: string;
  maxLength?: number;
  inputPadding?: string;
  disabled?: boolean;
  placeholder?: string;
  readonly?: boolean;
  ref?: any;
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
  icon,
  action,
  children = '',
  error,
  type = 'text',
  required = false,
  maxLength,
  inputPadding = 'pr-12',
  disabled,
  value,
  placeholder = '',
  readonly,
  ref,
  ...rest
}: TextProps) => {
  const baseCSS = `w-full h-[70px] p-6 rounded-2xl bg-transparent border border-white border-opacity-30 border-dashed flex-col justify-start items-start inline-flex outline-none text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-InterTight leading-snug tracking-wide`;
  const errorCSS = `text-red-600 text-sm mt-2`;
  const inputPaddingRight = action ? inputPadding : '';

  return (
    <div className="relative w-full">
      <div>
        {icon && (
          <div className={`${error ? 'top-[35%]' : 'top-1/2'} absolute left-6 transform -translate-y-1/2 text-white`}>
            {icon}
          </div>
        )}
        <input
          {...rest}
          type={type}
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          readOnly={readonly}
          placeholder={placeholder}
          className={twMerge(
            baseCSS,
            rest.className,
            inputPaddingRight,
            error ? 'border-red-600 border-opacity-100' : ''
          )}
        />
        {action && (
          <div className={`${error ? 'top-[40%]' : 'top-1/2'} absolute right-4 transform -translate-y-1/2 text-white`}>
            {action}
          </div>
        )}
      </div>
      {error && (
        <div id={`${rest.id}-error`} className={errorCSS}>
          {error}
        </div>
      )}
    </div>
  );
};
