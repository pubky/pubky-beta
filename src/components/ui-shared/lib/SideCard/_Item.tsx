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

export const Item = ({ id, icon, label, value, selected, disabled = false, ...rest }: ItemProps) => {
  const disabledCSS = disabled ? 'cursor-default' : '';
  const baseCSS = `w-full h-10 py-2 shadow backdrop-blur-[10px] items-center justify-between inline-flex`;
  return (
    <button id={id} {...rest} key={value} disabled={disabled} className={twMerge(baseCSS, disabledCSS, rest.className)}>
      <div className={`w-full justify-start items-center contents`}>
        <div
          className={`flex gap-2 items-center w-full ${
            disabled ? 'opacity-20' : selected ? 'opacity-100' : 'opacity-50 hover:opacity-80'
          }`}
        >
          {icon}
          <Typography.Body className="leading-[18px] tracking-normal" variant="medium-bold">
            {label}
          </Typography.Body>
        </div>
      </div>
    </button>
  );
};
