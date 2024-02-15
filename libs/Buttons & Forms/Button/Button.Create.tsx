'use client';

import { useState } from 'react';
import { Icon } from '../Icon';

type CreateButtonProps = {
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Create = ({
  width = 'w-[96px]',
  height = 'h-[96px]',
  styles = '',
  ...props
}: CreateButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cssStyle = `${width} ${height} border-[11px] border-fuchsia-500 hover:bg-fuchsia-500 hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`;
  const pencilStyle =
    isHovered &&
    'transition-[transform] duration-[0.3s] ease-[ease] rotate-[20deg]';

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${cssStyle} ${styles}`}
      {...props}
    >
      <div className={`${pencilStyle}`}>
        <Icon.Pencil />
      </div>
    </button>
  );
};
