import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SmallProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Small = ({ children, ...rest }: SmallProps) => {
  const baseCSS =
    'w-full absolute border border-white/30 -bottom-[16px] bottom-full left-1/2 transform -translate-x-1/2 translate-y-[10px] bg-[#05050A] text-white p-6 rounded-md shadow-md z-50';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
      <div className="absolute -bottom-[16px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-8 border-solid border-white/30 border-b-transparent border-l-transparent border-r-transparent" />
    </div>
  );
};
