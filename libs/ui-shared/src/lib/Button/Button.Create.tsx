import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';

interface CreateButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const Create = ({
  icon = <Icon.Pencil />,
  ...rest
}: CreateButtonProps) => {
  return (
    <button
      {...rest}
      className={twMerge(
        `w-[96px] h-[96px] hover:transition-[transform] hover:duration-[0.3s] hover:ease-[ease] hover:rotate-[20deg] border-[11px] border-fuchsia-500 hover:bg-fuchsia-500 hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`,
        rest.className
      )}
    >
      {icon}
    </button>
  );
};
