'use client';

import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface MainProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: any;
  onClickOutside?: (event: MouseEvent | TouchEvent) => void;
}

export const Main = ({ children, ref, onClickOutside, ...rest }: MainProps) => {
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

  useEffect(() => {
    if (!onClickOutside) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = tooltipRef.current;
      if (!element || element.contains(event.target as Node)) {
        return;
      }
      onClickOutside(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [onClickOutside]);

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
