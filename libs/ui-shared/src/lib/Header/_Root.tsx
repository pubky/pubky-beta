'use client';

import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Root = ({ children, ...rest }: HeaderRootProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const baseCSS = `w-full max-w-[380px] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1200px] ${
    scrolled ? 'h-1.5 sm:h-[14px]' : 'h-3.5 sm:h-[144px]'
  } transition-all duration-100 bg-[#020203] mx-auto py-12 gap-6 flex items-center justify-between`;

  return (
    <div
      className={twMerge(
        'sticky top-0 z-50 border-solid border-white border-opacity-10',
        scrolled && 'border-b',
        rest.className
      )}
    >
      <header {...rest} className={twMerge(baseCSS, rest.className)}>
        {children}
      </header>
    </div>
  );
};
