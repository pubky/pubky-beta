'use client';

import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  setShowTooltip: (show: boolean) => void;
  delay?: number;
}

export const Root = ({
  children,
  setShowTooltip,
  delay,
  ...rest
}: RootProps) => {
  const [timeout, setTimeout] = useState<number | null>(null);
  const baseCSS = 'relative inline-block';

  const handleMouseEnter = () => {
    if (delay) {
      const timeoutId = window.setTimeout(() => {
        setShowTooltip(true);
      }, delay);
      setTimeout(timeoutId);
    } else {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      setTimeout(null);
    }
    setShowTooltip(false);
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
