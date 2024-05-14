import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Main = ({ children, ...rest }: MainProps) => {
  const baseCSS =
    'w-full absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[10px] bg-gradient-to-b from-[#07040a] to-[#1b1820] text-white px-8 py-6 rounded-md shadow-md z-50';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
};
