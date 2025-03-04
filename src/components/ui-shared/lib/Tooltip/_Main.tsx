'use client';

import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: any;
}

export const Main = ({ children, ref, ...rest }: MainProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');

  useEffect(() => {
    const tooltipElement = tooltipRef.current;
    if (tooltipElement) {
      const rect = tooltipElement.getBoundingClientRect();
      if (rect.top < 0) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, []);

  const baseCSS =
    'w-full absolute left-1/2 transform -translate-x-1/2 bg-[#05050A] border border-white border-opacity-30 text-white px-8 py-6 rounded-[20px] shadow-md z-50';

  const topPositionCSS = 'bottom-full translate-y-[10px]';
  const bottomPositionCSS = 'top-full -translate-y-[10px]';

  return (
    <div
      ref={ref || tooltipRef}
      {...rest}
      className={twMerge(baseCSS, position === 'top' ? topPositionCSS : bottomPositionCSS, rest.className)}
    >
      {children}
    </div>
  );
};
