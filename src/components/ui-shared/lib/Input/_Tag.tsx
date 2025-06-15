import { Icon } from '../../index';

export interface InputTagProps {
  /**
   * The id prefix of the tag elements
   */
  idPrefix?: string;
  /**
   * The current value of the tag input
   */
  value: string;
  /**
   * Called when the value changes
   */
  onChange: (value: string) => void;
  /**
   * Called when the input is clicked
   */
  onClick?: (event: any) => void;
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
  /**
   * ref of the input
   */
  ref?: any;
  /**
   * Whether to auto complete the input
   * @default false
   */
  autoComplete?: boolean;
}

export const Tag = ({
  idPrefix,
  value,
  onChange,
  onClick,
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
  autoFocus = false,
  ref,
  autoComplete = false
}: InputTagProps) => {
  // Container size classes
  const containerSizeClasses = variant === 'small' ? 'h-[32px] rounded-lg' : 'h-[70px] rounded-2xl';

  // Input size classes
  const inputSizeClasses = variant === 'small' ? 'w-[140px] text-[14px] pl-3 pr-1' : 'w-full text-[17px] pl-6 pr-1';

  // Button styles
  const buttonClasses =
    variant === 'small' ? 'p-1 rounded-full bg-white bg-opacity-10' : 'p-3 rounded-full bg-white bg-opacity-10';

  // Handle key press (Enter to add tag)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddTag(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value.toLowerCase().replace(/\s/g, '');
    onChange(valueWithoutSpaces);
  };

  return (
    <div
      className={`flex items-center ${containerSizeClasses} border border-white border-opacity-30 border-dashed bg-transparent ${className}`}
    >
      <input
        id={idPrefix ? `${idPrefix}-add-tag-input` : 'add-tag-input'}
        ref={ref}
        type="text"
        placeholder="add tag"
        className={`h-full bg-transparent outline-none text-white text-opacity-80 font-normal font-InterTight placeholder:text-white placeholder:text-opacity-30 ${inputSizeClasses} ${inputClassName}`}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        autoFocus={autoFocus}
        autoComplete={autoComplete ? 'on' : 'off'}
      />
      <div className={`flex ${variant === 'small' ? 'gap-1 px-2' : 'pr-4'} h-full items-center`}>
        {showAddButton && value && (
          <div>
            {loading ? (
              <div className={`cursor-pointer ${buttonClasses}`}>
                <Icon.LoadingSpin size={variant === 'small' ? '12' : '24'} />
              </div>
            ) : (
              <div
                id={idPrefix ? `${idPrefix}-add-tag-btn` : 'add-tag-btn'}
                onClick={!disabled && !loading ? () => onAddTag(value) : undefined}
                className={`cursor-pointer ${buttonClasses} ${loading ? 'opacity-50' : 'opacity-80 hover:opacity-100'}`}
              >
                <Icon.Plus size={variant === 'small' ? '12' : '24'} />
              </div>
            )}
          </div>
        )}

        {showEmojiPicker && onEmojiPickerClick && (
          <div
            id={idPrefix ? `${idPrefix}-emoji-picker-btn` : 'emoji-picker-btn'}
            onClick={!disabled && !loading ? onEmojiPickerClick : undefined}
            className={`${variant === 'small' ? 'hidden mr-1 lg:flex' : 'hidden ml-2 lg:flex'} cursor-pointer ${buttonClasses} opacity-80 hover:opacity-100`}
          >
            <Icon.Smiley size={variant === 'small' ? '12' : '24'} />
          </div>
        )}

        {showCloseButton && onClose && (
          <div
            id={idPrefix ? `${idPrefix}-close-tag-btn` : 'close-tag-btn'}
            onClick={onClose}
            className={`cursor-pointer ${buttonClasses} opacity-80 hover:opacity-100`}
          >
            <Icon.X size={variant === 'small' ? '12' : '24'} />
          </div>
        )}
      </div>
    </div>
  );
};
