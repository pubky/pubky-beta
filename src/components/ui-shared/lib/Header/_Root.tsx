'use client';

import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Root = ({ children, ...rest }: HeaderRootProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    const updateScrollbarWidth = () => {
      setScrollbarWidth(window.innerWidth - document.documentElement.clientWidth);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateScrollbarWidth);
    updateScrollbarWidth();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollbarWidth);
    };
  }, []);

  const baseCSS = `w-full max-w-[380px] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1200px] ${
    scrolled ? 'h-1.5 sm:h-[14px]' : 'h-3.5 sm:h-[144px]'
  } transition-all duration-100 bg-transparent bg-opacity-50 mx-auto py-12 gap-6 flex items-center justify-between`;

  return (
    <div
      style={{ paddingRight: `${scrollbarWidth}px` }}
      className={twMerge(
        'fixed w-full top-0 z-50 bg-gradient-to-b from-[#05050a] via-[#05050a] via-60% to-transparent',
        rest.className
      )}
    >
      <header {...rest} className={twMerge(baseCSS, rest.className)}>
        {children}
      </header>
    </div>
  );
};
