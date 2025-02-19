import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'warning';
}

export const Message = ({
  icon,
  children,
  variant = 'default',
  ...rest
}: MessageProps) => {
  const baseCSS = `relative py-2 px-4 rounded-md shadow border w-full`;

  let variantCSS = '';
  let colorTextCSS = '';

  switch (variant) {
    case 'warning':
      variantCSS =
        'bg-yellow-600 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-yellow-500';
      colorTextCSS = 'text-white';
      break;
    case 'default':
    default:
      variantCSS =
        'bg-[#C8FF00] bg-opacity-10 shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] border-[#C8FF00]';
      colorTextCSS = 'text-[#c8ff00]';
      break;
  }

  return (
    <div
      id="message-alert"
      {...rest}
      className={twMerge(baseCSS, variantCSS, rest.className)}
    >
      <div className="flex gap-1 items-center">
        {icon && <div className="relative">{icon}</div>}
        <Typography.Body
          className={twMerge(colorTextCSS, 'text-opacity-80')}
          variant="small"
        >
          {children}
        </Typography.Body>
      </div>
    </div>
  );
};
