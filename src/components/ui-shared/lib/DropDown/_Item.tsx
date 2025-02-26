import { Typography } from '../Typography';
import { Icon } from '../Icon';

import { twMerge } from 'tailwind-merge';

interface ItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  value: string;
  selected: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const Item = ({ icon, label, value, selected, disabled = false, ...rest }: ItemProps) => {
  const disabledCSS = disabled ? 'opacity-20 cursor-default' : selected ? 'opacity-100' : 'opacity-50 hover:opacity-80';
  const baseCSS = `w-full min-w-60 h-12 py-2 shadow backdrop-blur-[10px] items-center justify-between inline-flex`;

  return (
    <button {...rest} key={value} className={twMerge(baseCSS, disabledCSS, rest.className)}>
      <div className="w-14 justify-start items-center contents">
        <div className="flex gap-2 items-center">
          {icon}
          <Typography.Body variant="medium-bold">{label}</Typography.Body>
        </div>
        {selected && (
          <div>
            <Icon.Check size="32" />
          </div>
        )}
      </div>
    </button>
  );
};
