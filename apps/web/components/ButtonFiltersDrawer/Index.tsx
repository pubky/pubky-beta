'use client';

import { Icon } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface ButtonFiltersProps extends React.HTMLAttributes<HTMLButtonElement> {
  rootCSS?: string;
}

export default function ButtonFilters({
  rootCSS = 'sticky top-[160px]',
  ...rest
}: ButtonFiltersProps) {
  const baseCSS =
    '2xl:-ml-4 hidden lg:inline-flex cursor-pointer absolute p-5 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-tr-[48px] rounded-br-[48px] justify-center items-center gap-2';
  return (
    <div className={rootCSS}>
      <button {...rest} className={twMerge(baseCSS, rest.className)}>
        <Icon.SlidersHorizontal />
      </button>
    </div>
  );
}
