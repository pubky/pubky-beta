import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children: string;
  variant?: 'default' | 'warning';
}

export const Message = ({
  icon,
  children,
  variant = 'default',
  ...rest
}: MessageProps) => {
  const baseCSS = `fixed bottom-8 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded-md shadow border`;

  let variantCSS = '';

  switch (variant) {
    case 'warning':
      variantCSS = 'bg-yellow-600 border-yellow-500';
      break;
    case 'default':
    default:
      variantCSS = 'bg-white bg-opacity-20 backdrop-blur-[50px]  border-white';
      break;
  }

  return (
    <div {...rest} className={twMerge(baseCSS, variantCSS, rest.className)}>
      <div className="flex gap-2">
        {icon && <div className="relative">{icon}</div>}
        <Typography.Body className="text-opacity-80" variant="small">
          {children}
        </Typography.Body>
      </div>
    </div>
  );
};
