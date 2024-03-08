import { Typography } from '../Typography';
import { Icon } from '../Icon';

import { twMerge } from 'tailwind-merge';

interface ItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  value: string;
  selected: boolean;
  icon?: React.ReactNode;
  iconLabel?: boolean;
}

export const Item = ({
  icon,
  label,
  value,
  selected,
  iconLabel = false,
  ...rest
}: ItemProps) => {
  const baseCSS = `w-60 h-12 py-2 shadow border-b border-white border-opacity-10 backdrop-blur-[10px] items-center inline-flex`;

  return (
    <button
      {...rest}
      key={value}
      className={twMerge(
        baseCSS,
        iconLabel ? 'justify-start' : 'justify-between',
        rest.className
      )}
    >
      <div className="w-14 justify-start items-center contents">
        {icon && <div className="mr-2">{icon}</div>}
        <Typography.Body variant="medium-bold">{label}</Typography.Body>
        {selected && !iconLabel && (
          <div>
            <Icon.Check size="32" />
          </div>
        )}
      </div>
    </button>
  );
};
