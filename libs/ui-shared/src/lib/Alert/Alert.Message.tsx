import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  children: string;
}

export const Message = ({ icon, children, ...rest }: MessageProps) => {
  const baseCSS = `fixed bottom-8 left-1/2 transform -translate-x-1/2 py-2 px-4 bg-[#793288] rounded-md shadow border border-fuchsia-500`;
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <div className="flex gap-2">
        {icon && <div className="relative">{icon}</div>}
        <Typography.Body className="text-opacity-80" variant="small">
          {children}
        </Typography.Body>
      </div>
    </div>
  );
};
