import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SmallProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Small = ({ children, ...rest }: SmallProps) => {
  const baseCSS =
    'w-full absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[10px]  bg-gradient-to-br from-black to-[#0e0e18] text-white px-8 py-6 rounded-md shadow-md z-50';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
      <div className="absolute -bottom-[15px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-8 border-solid border-black border-b-transparent border-l-transparent border-r-transparent" />
    </div>
  );
};
