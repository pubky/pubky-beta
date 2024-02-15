'use client';

import { useState } from 'react';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

type SelectButtonProps = {
  children: string;
  variant?: 'default' | 'large' | 'small';
  svg?: React.ReactNode;
  disable?: boolean;
  width?: string;
  height?: string;
  styles?: string;
  className?: string;
};

export const Select = ({
  children,
  svg,
  variant = 'default',
  disable = false,
  width = 'w-full',
  height = 'h-20',
  styles = '',
  ...props
}: SelectButtonProps) => {
  const [clicked, setClicked] = useState(false);
  const color = disable ? 'text-gray-500' : 'text-white';
  const colorIcon = disable ? 'grey' : undefined;
  const colorBorder = clicked ? 'border-t border-fuchsia-500' : '';
  const backgroundColor = clicked
    ? 'bg-fuchsia-500 bg-opacity-20'
    : 'bg-white bg-opacity-10';
  let disabled = disable ? 'bg-opacity-10 cursor-auto' : 'hover:bg-opacity-20';
  let size = `${width} ${height}`;

  const handleButtonClick = () => {
    if (!disable) {
      setClicked(!clicked);
    }
  };

  switch (variant) {
    case 'large':
      size = `w-[162px] h-20`;
      break;
    case 'small':
      size = `w-32 h-12`;
      break;
  }

  const cssClasses = `${size} ${colorBorder} px-6 py-[15px] ${backgroundColor} rounded-lg justify-center items-center gap-2 inline-flex ${disabled}`;

  return (
    <button
      onClick={handleButtonClick}
      className={`${cssClasses} ${styles}`}
      {...props}
    >
      <div className="justify-center items-center flex">
        {svg ? svg : <Icon.Asterisk color={colorIcon} />}
      </div>
      <Typography.Body variant="small-bold" color={color}>
        {children}
      </Typography.Body>
    </button>
  );
};
