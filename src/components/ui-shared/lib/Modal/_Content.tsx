import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Content = ({ children, ...rest }: ContentProps) => {
  return (
    <div {...rest} className={twMerge(`grid grid-cols-3 gap-6`, rest.className)}>
      {children}
    </div>
  );
};
