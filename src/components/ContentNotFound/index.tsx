import { Typography } from '@social/ui-shared';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ContentNotFoundProps {
  icon?: React.ReactElement;
  title?: string;
  description?: React.ReactNode | string;
  className?: string;
  children?: React.ReactNode;
}

export default function ContentNotFound({ icon, title, description, className, children }: ContentNotFoundProps) {
  const baseCSS = 'w-full p-12 relative flex-col justify-center items-center gap-6 inline-flex';
  return (
    <div className={twMerge(baseCSS, className)}>
      <div className="z-[1] inline-flex flex-col gap-6 items-center">
        {icon && (
          <div className="p-4 bg-[#c8ff00]/10 rounded-full justify-center items-center gap-2.5 inline-flex">{icon}</div>
        )}
        {title && (
          <Typography.Body className="text-center break-words" variant="large-bold">
            {title}
          </Typography.Body>
        )}
        {description && (
          <Typography.Body variant="medium" className="text-opacity-80 text-center">
            {description}
          </Typography.Body>
        )}
      </div>
      {children}
    </div>
  );
}
