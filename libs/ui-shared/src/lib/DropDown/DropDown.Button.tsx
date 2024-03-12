import { Icon } from '../Icon';
import { Button as ButtonUI } from '../Button';

import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  iconLabel?: React.ReactNode;
  label?: string;
  size?: 'small' | 'default' | string;
}

export const Button = ({
  isOpen,
  iconLabel,
  label = '',
  size = 'default',
  ...rest
}: ButtonProps) => {
  const baseCSS = `w-full flex items-center justify-between cursor-pointer`;
  const arrowStyle = `ml-1 transition ease duration-300`;
  const styleSelect = `bg-transparent text-white outline-none appearance-none font-['Inter Tight'] tracking-wide`;

  return (
    <div
      {...rest}
      className={twMerge(
        baseCSS,
        styleSelect,
        size === 'default'
          ? 'text-sm sm:text-2xl font-normal'
          : 'text-opacity-50 text-[13px] font-semibold uppercase',
        rest.className
      )}
    >
      {iconLabel ? (
        <ButtonUI.Action variant="custom" icon={iconLabel} />
      ) : (
        <>
          {label}
          <div
            className={twMerge(
              arrowStyle,
              label ? 'mt-1' : 'mt-0.5',
              isOpen ? 'rotate-180' : 'rotate-0',
              rest.className
            )}
          >
            <Icon.DropdownIcon color={size === 'default' ? 'white' : 'gray'} />
          </div>
        </>
      )}
    </div>
  );
};
