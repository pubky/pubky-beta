import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';

interface CreateButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const Create = ({ icon, ...rest }: CreateButtonProps) => {
  const responsiveCSS = 'md:w-[96px] md:h-[96px]';
  const baseCSS = `w-20 h-20 lg:border border-white bg-white bg-opacity-10 backdrop-blur-md hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`;
  const iconWrapperCSS =
    'relative transition-transform duration-300 ease-in-out transform scale-75 hover:scale-100 md:scale-100 md:hover:scale-125';
  return (
    <button {...rest} className={twMerge(baseCSS, responsiveCSS, rest.className)}>
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
