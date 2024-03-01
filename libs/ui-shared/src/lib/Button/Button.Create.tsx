import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';

interface CreateButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const Create = ({ icon, ...rest }: CreateButtonProps) => {
  const responsiveCSS = 'sm:w-[96px] sm:h-[96px] sm:border-[11px]';
  const baseCSS = `w-[56px] h-[56px] border-[6px] hover:transition-[transform] hover:duration-[0.3s] hover:ease-[ease] hover:rotate-[20deg] border-fuchsia-500 hover:bg-fuchsia-500 hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`;

  let size;
  if (window.innerWidth < 640) {
    size = '26';
  } else {
    size = '48';
  }
  return (
    <button
      {...rest}
      className={twMerge(baseCSS, responsiveCSS, rest.className)}
    >
      {icon ? icon : <Icon.Pencil size={size} />}
    </button>
  );
};
