import React from 'react';
import { Icon } from '../Icon';

interface CreateButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  icon?: React.ReactNode;
  styles?: string;
  className?: string;
}

export const Create = ({
  width = 'w-[96px]',
  height = 'h-[96px]',
  icon = <Icon.Pencil />,
  styles = '',
  ...rest
}: CreateButtonProps) => {
  const cssStyle = `${width} ${height} border-[11px] border-fuchsia-500 hover:bg-fuchsia-500 hover:bg-opacity-30 rounded-[96px] flex items-center justify-center cursor-pointer`;

  return (
    <button className={`${cssStyle} ${styles}`} {...rest}>
      <div
        className={`hover:transition-[transform] hover:duration-[0.3s] hover:ease-[ease] hover:rotate-[20deg]`}
      >
        {icon}
      </div>
    </button>
  );
};
