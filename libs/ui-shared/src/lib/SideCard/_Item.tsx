import { Typography } from '../Typography';

import { twMerge } from 'tailwind-merge';

interface ItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  id?: string;
  label: string;
  value: string;
  selected?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export const Item = ({
  id,
  icon,
  label,
  value,
  selected,
  disabled = false,
  ...rest
}: ItemProps) => {
  const disabledCSS = disabled ? 'cursor-default' : '';
  const baseCSS = `w-full h-12 py-2 shadow backdrop-blur-[10px] items-center justify-between inline-flex`;

  return (
    <button
      id={id}
      {...rest}
      key={value}
      className={twMerge(baseCSS, disabledCSS, rest.className)}
    >
      <div className="w-14 justify-start items-center contents">
        <div
          className={`flex gap-2 items-center ${
            disabled
              ? 'opacity-20'
              : selected
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
        >
          {icon}
          <Typography.Body variant="medium-bold">{label}</Typography.Body>
        </div>
        {/**{selected && (
          <div>
            <Icon.Check size="28" />
          </div>
        )}*/}
      </div>
    </button>
  );
};
