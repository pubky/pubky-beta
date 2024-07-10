import { Typography } from '../Typography';
import { Icon } from '../Icon';

import { twMerge } from 'tailwind-merge';

interface ItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  value: string;
  selected?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const Item = ({
  icon,
  label,
  value,
  selected,
  disabled = false,
  ...rest
}: ItemProps) => {
  const disabledCSS = disabled
    ? 'cursor-default'
    : 'hover:bg-white hover:bg-opacity-10';
  const baseCSS = `w-full h-12 py-2 shadow backdrop-blur-[10px] items-center justify-between inline-flex`;

  return (
    <button
      {...rest}
      key={value}
      className={twMerge(baseCSS, disabledCSS, rest.className)}
    >
      <div className="w-14 justify-start items-center contents">
        <div className="flex gap-2 items-center">
          {icon}
          <Typography.Body
            className={disabled ? 'text-opacity-30' : ''}
            variant="medium-bold"
          >
            {label}
          </Typography.Body>
        </div>
        {selected && (
          <div>
            <Icon.Check size="28" />
          </div>
        )}
      </div>
    </button>
  );
};
