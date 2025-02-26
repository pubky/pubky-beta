import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';
import { Typography } from '../Typography';
import React, { useMemo } from 'react';

interface SelectButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  text: string;
  size?: 'large' | 'small';
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  onClick: (active: boolean) => void;
}

export const Select = ({
  text,
  icon,
  disabled = false,
  size = 'large',
  active = false,
  onClick,
  ...rest
}: SelectButtonProps) => {
  const handleButtonClick = () => {
    if (!disabled) {
      onClick(!active);
    }
  };

  const { baseCSS, iconColor, bodyCSS } = useMemo(() => {
    const sizeCSS = `w-full ${size === 'large' ? 'h-20' : 'h-12'}`;
    const colorBorder = active ? 'border-white' : 'border-white border-opacity-10';
    const backgroundColor = active ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-10';
    const disabledCSS = disabled ? 'bg-opacity-10 cursor-auto' : 'hover:bg-opacity-20';

    return {
      baseCSS: twMerge(
        `border-t px-2 sm:px-6 py-[15px] rounded-lg justify-center items-center gap-2 inline-flex`,
        sizeCSS,
        colorBorder,
        backgroundColor,
        disabledCSS,
        rest.className
      ),
      iconColor: disabled ? 'grey' : undefined,
      bodyCSS: disabled ? 'text-gray-500' : 'text-white'
    };
  }, [size, active, disabled, rest.className]);

  return (
    <button {...rest} onClick={handleButtonClick} className={baseCSS}>
      <div>{icon || <Icon.UserRectangle color={iconColor} />}</div>
      <Typography.Body variant="small-bold" className={`hidden lg:block ${bodyCSS}`}>
        {text}
      </Typography.Body>
    </button>
  );
};
