'use client';

import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface TextMenuProps extends React.HTMLAttributes<HTMLInputElement> {
  options: string[];
  action?: React.ReactNode;
  error?: string;
  required?: boolean;
  value?: string;
  maxLength?: number;
  inputPadding?: string;
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
  disabled?: boolean;
}

export const TextMenu = ({
  options,
  action,
  error,
  type = 'text',
  required = false,
  maxLength,
  inputPadding = 'pr-12',
  value,
  disabled = false,
  ...rest
}: TextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const menuRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
    if (rest.onChange) {
      const event = {
        target: { value: option },
      } as React.ChangeEvent<HTMLInputElement>;
      rest.onChange(event);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const baseCSS = `w-full h-[70px] p-6 rounded-2xl bg-transparent border border-white border-opacity-30 border-dashed flex-col justify-start items-start inline-flex outline-none text-white text-opacity-80 placeholder:text-white placeholder:text-opacity-30 text-[17px] font-normal font-InterTight leading-snug tracking-wide`;
  const errorCSS = `text-red-600 text-sm mt-2`;
  const inputPaddingRight = action ? inputPadding : '';

  return (
    <div className="relative w-full" ref={menuRef}>
      <div>
        <input
          {...rest}
          type={type}
          value={inputValue}
          readOnly
          onChange={handleInputChange}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          maxLength={maxLength}
          required={required}
          className={twMerge(
            baseCSS,
            inputPaddingRight,
            rest.className,
            error ? 'border-red-600 border-opacity-100' : '',
            disabled ? 'opacity-30 cursor-not-allowed' : ''
          )}
          disabled={disabled}
        />
        {action && (
          <div
            className={`${
              error ? 'top-[40%]' : 'top-1/2'
            } absolute right-4 transform -translate-y-1/2 text-white`}
          >
            {action}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-webkit absolute z-10 w-full bg-[#05050a] border border-white border-opacity-30 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer hover:bg-white hover:bg-opacity-10"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {error && <div className={errorCSS}>{error}</div>}
    </div>
  );
};
