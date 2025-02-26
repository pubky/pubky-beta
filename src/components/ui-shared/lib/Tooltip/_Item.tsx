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

export const Item = ({ children, icon, loading, cssText, ...rest }: ItemProps) => {
  const baseCSS = 'opacity-50 hover:opacity-80 w-full h-10 items-center justify-between inline-flex';
  return (
    <button {...rest} className={twMerge(baseCSS, rest.className)}>
      <div className="w-full p-2 flex gap-2 items-center">
        {loading ? <Icon.LoadingSpin size="24" /> : icon}
        <Typography.Body className={twMerge('text-[15px]', cssText)} variant="medium-bold">
          {loading ? 'Loading' : children}
        </Typography.Body>
      </div>
    </button>
  );
};
