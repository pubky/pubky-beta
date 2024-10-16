import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface ItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
  cssText?: string;
}

export const Item = ({
  children,
  icon,
  loading,
  cssText,
  ...rest
}: ItemProps) => {
  const baseCSS = 'hover:bg-white hover:bg-opacity-10 rounded-lg w-full h-10 items-center justify-between inline-flex';
  return (
    <button {...rest} className={twMerge(baseCSS, rest.className)}>
      <div className="w-full p-2 flex gap-4 items-center">
        {loading ? <Icon.LoadingSpin size="20" /> : icon}
        <Typography.Body
          className={twMerge('text-[15px]', cssText)}
          variant="medium-bold"
        >
          {loading ? 'Loading' : children}
        </Typography.Body>
      </div>
    </button>
  );
};
