'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  setShowTooltip: (tagId: string) => void;
  delay?: number;
  tagId?: string;
}

export const Root = ({ children, setShowTooltip, delay, tagId = '', ...rest }: RootProps) => {
  const [timeout, setTimeout] = useState<number | null>(null);
  const baseCSS = 'relative inline-block';

  const handleMouseEnter = () => {
    if (delay) {
      const timeoutId = window.setTimeout(() => {
        setShowTooltip(tagId);
      }, delay);
      setTimeout(timeoutId);
    } else {
      setShowTooltip(tagId);
    }
  };

  const handleMouseLeave = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      setTimeout(null);
    }
    setShowTooltip('');
  };
  return (
    <div
      {...rest}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={twMerge(baseCSS, rest.className)}
    >
      {children}
    </div>
  );
};
