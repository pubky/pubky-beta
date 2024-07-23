import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'onChange'
  > {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Switch = ({
  checked = false,
  disabled = false,
  onChange,
  ...rest
}: SwitchProps) => {
  const toggleSwitch = () => {
    if (!disabled) {
      onChange && onChange(!checked);
    }
  };

  const switchStyles = useMemo(() => {
    const baseCSS = `relative inline-flex select-none items-center`;
    const cursorCSS = disabled ? 'cursor-default' : 'cursor-pointer';
    const backgroundCSS = checked
      ? 'bg-fuchsia-500 bg-opacity-20 border border-fuchsia-500'
      : 'bg-white bg-opacity-10';
    const dotPositionCSS = checked ? 'translate-x-6' : '';
    const dotColorCSS = disabled ? 'bg-white bg-opacity-30' : 'bg-white';

    return {
      labelClass: twMerge(baseCSS, cursorCSS),
      spanClass: `flex h-8 w-[52px] items-center rounded-full p-1 duration-200 ${backgroundCSS}`,
      dotClass: `h-[18px] w-[18px] rounded-full duration-200 ${dotColorCSS} ${dotPositionCSS}`,
    };
  }, [checked, disabled]);

  return (
    <label className={switchStyles.labelClass}>
      <input
        {...rest}
        type="checkbox"
        className="sr-only"
        onChange={onChange && toggleSwitch}
        disabled={disabled} // Explicitly setting disabled prop for clarity
      />
      <span className={switchStyles.spanClass}>
        <span className={switchStyles.dotClass} />
      </span>
    </label>
  );
};
