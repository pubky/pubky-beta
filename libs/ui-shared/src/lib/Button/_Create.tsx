import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';

interface CreateButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const Create = ({ icon, ...rest }: CreateButtonProps) => {
  const responsiveCSS = 'sm:w-[96px] sm:h-[96px]';
  const baseCSS = `w-[56px] h-[56px] border border-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`;
  const iconWrapperCSS =
    'relative transition-transform duration-300 ease-in-out transform scale-75 sm:scale-100 hover:scale-90 sm:hover:scale-125';
  return (
    <button
      {...rest}
      className={twMerge(baseCSS, responsiveCSS, rest.className)}
    >
      {icon ? (
        icon
      ) : (
        <div className={iconWrapperCSS}>
          <Icon.Plus size="48" />
        </div>
      )}
    </button>
  );
};
