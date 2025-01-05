'use client';

import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  drawerRef: React.RefObject<HTMLDivElement>;
  drawerOpen: boolean;
  position?: 'left' | 'right';
}

export const Root = ({
  drawerRef,
  drawerOpen,
  children,
  position = 'right',
  ...rest
}: RootProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      setIsVisible(true);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      setTimeout(() => setIsVisible(false), 500);
    }
  }, [drawerOpen]);

  const positionDrawer = position === 'left' ? 'left-0' : 'right-0';
  const translateClass =
    position === 'left' ? '-translate-x-full' : 'translate-x-full';

  const baseCSS = `${positionDrawer} w-[80%] md:w-[385px] fixed top-0 z-50 h-screen transition-transform duration-300 p-12 bg-[#05050A] shadow border-r border-white border-opacity-20`;

  if (!isVisible) return null;

  return (
    <div
      {...rest}
      ref={drawerRef}
      id="drawer-example"
      className={twMerge(
        baseCSS,
        animateIn ? 'translate-x-0' : translateClass,
        rest.className,
      )}
      tabIndex={-1}
      aria-labelledby="drawer-label"
    >
      {children}
    </div>
  );
};
