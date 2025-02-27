'use client';

import React, { useRef } from 'react';
import { Icon } from '../../index';

export interface InputTagProps {
  /**
   * The current value of the tag input
   */
  value: string;
  /**
   * Called when the value changes
   */
  onChange: (value: string) => void;
  /**
   * Called when a tag should be added (on Enter key or add button click)
   */
  onAddTag: (tag: string) => void;
  /**
   * Whether to show the emoji picker button
   * @default true
   */
  showEmojiPicker?: boolean;
  /**
   * Called when the emoji picker button is clicked
   */
  onEmojiPickerClick?: () => void;
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Maximum length of the tag
   * @default 20
   */
  maxLength?: number;
  /**
   * Style variant - 'default' for regular size or 'small' for compact
   * @default 'default'
   */
  variant?: 'default' | 'small';
  /**
   * Whether to show the add button when there's input
   * @default true
   */
  showAddButton?: boolean;
  /**
   * Whether to show the close button
   * @default false
   */
  showCloseButton?: boolean;
  /**
   * Called when the close button is clicked
   */
  onClose?: () => void;
  /**
   * Whether loading state is active (shows loading spinner instead of add icon)
   * @default false
   */
  loading?: boolean;
  /**
   * Optional CSS class name for the container
   */
  className?: string;
  /**
   * Optional CSS class name for the input
   */
  inputClassName?: string;
  /**
   * Set focus on input automatically
   * @default false
   */
  autoFocus?: boolean;
}

export const Tag = ({
  value,
  onChange,
  onAddTag,
  showEmojiPicker = true,
  onEmojiPickerClick,
  disabled = false,
  maxLength = 20,
  variant = 'default',
  showAddButton = true,
  showCloseButton = false,
  onClose,
  loading = false,
  className = '',
  inputClassName = '',
  autoFocus = false
}: InputTagProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Container size classes
  const containerSizeClasses = variant === 'small' ? 'h-[32px] rounded-lg' : 'h-[70px] rounded-2xl';

  // Input size classes
  const inputSizeClasses =
    variant === 'small' ? 'w-[120px] text-[14px] pl-3 pr-1' : 'flex-1 max-w-[calc(100%-100px)] text-[17px] pl-6 pr-1';

  // Button styles
  const buttonClasses = variant === 'small' ? 'p-1 rounded-full bg-white bg-opacity-10' : '';

  // Handle key press (Enter to add tag)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddTag(value);
    }
  };

  return (
    <div
      className={`flex items-center ${containerSizeClasses} border border-white border-opacity-30 border-dashed bg-transparent ${className}`}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="tag"
        className={`h-full bg-transparent outline-none text-white text-opacity-80 font-normal font-InterTight ${inputSizeClasses} ${inputClassName}`}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        autoFocus={autoFocus}
      />
      <div className={`flex ${variant === 'small' ? 'gap-1 px-2' : 'pr-4'} h-full items-center`}>
        {showAddButton && value && (
          <div
            onClick={!disabled && !loading ? () => onAddTag(value) : undefined}
            className={`cursor-pointer ${buttonClasses} ${
              loading ? 'opacity-50' : 'opacity-80 hover:opacity-100'
            } ${variant === 'small' ? '' : ''}`}
          >
            {loading ? (
              <Icon.LoadingSpin size={variant === 'small' ? '12' : '18'} />
            ) : (
              <Icon.Plus size={variant === 'small' ? '12' : '18'} />
            )}
          </div>
        )}

        {showEmojiPicker && onEmojiPickerClick && (
          <div
            onClick={!disabled && !loading ? onEmojiPickerClick : undefined}
            className={`${variant === 'small' ? 'hidden mr-1 lg:flex' : 'hidden ml-2 lg:flex'} cursor-pointer ${buttonClasses} opacity-80 hover:opacity-100`}
          >
            <Icon.Smiley size={variant === 'small' ? '12' : '32'} />
          </div>
        )}

        {showCloseButton && onClose && (
          <div onClick={onClose} className={`cursor-pointer ${buttonClasses} opacity-80 hover:opacity-100`}>
            <Icon.X size={variant === 'small' ? '12' : '18'} />
          </div>
        )}
      </div>
    </div>
  );
};
