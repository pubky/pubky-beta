'use client';

import { Icon } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface ButtonFiltersProps extends React.HTMLAttributes<HTMLButtonElement> {
  rootCSS?: string;
}

export default function ButtonFilters({ rootCSS = 'z-10 fixed top-[150px] left-0', ...rest }: ButtonFiltersProps) {
  const baseCSS =
    'hidden lg:inline-flex cursor-pointer absolute px-4 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-tr-[48px] rounded-br-[48px] justify-center items-center gap-2';
  return (
    <div className={rootCSS}>
      <button {...rest} className={twMerge(baseCSS, rest.className)}>
        <Icon.SlidersHorizontal size="24" />
      </button>
    </div>
  );
}
