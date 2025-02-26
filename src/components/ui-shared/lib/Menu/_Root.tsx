'use client';

import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  drawerOpen: boolean;
  position?: 'left' | 'right';
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clickableArea?: boolean;
}

export const Root = ({
  drawerOpen,
  setDrawerOpen,
  children,
  position = 'right',
  clickableArea = true,
  ...rest
}: RootProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    if (drawerOpen) {
      setIsVisible(true);
      setTimeout(() => setAnimateIn(true), 10);

      document.body.style.overflow = 'hidden';
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setIsVisible(false), 300);

      document.body.style.overflow = '';
      return () => clearTimeout(timeout);
    }
  }, [drawerOpen]);

  const positionDrawer = position === 'left' ? 'left-0' : 'right-0';
  const translateClass = position === 'left' ? '-translate-x-full' : 'translate-x-full';

  const baseCSS = `${positionDrawer} w-[80%] md:w-[385px] h-full fixed top-0 z-50 transition-transform duration-300 p-12 bg-[#05050A] shadow border-r border-white border-opacity-20`;

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null) return;

    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;
    const threshold = 100;

    if (drawerOpen) {
      if (position === 'left' && diffX > threshold) {
        setDrawerOpen(false);
      } else if (position === 'right' && diffX < -threshold) {
        setDrawerOpen(false);
      }
    } else {
      if (position === 'left' && diffX < -threshold) {
        setDrawerOpen(true);
      } else if (position === 'right' && diffX > threshold) {
        setDrawerOpen(true);
      }
    }
  };

  if (!isVisible && !drawerOpen && clickableArea) {
    // Render swipe zone for opening the drawer
    const swipeZoneCSS = position === 'left' ? 'left-0' : 'right-0';

    return (
      <div
        className={`cursor-pointer fixed bottom-0 ${swipeZoneCSS} w-4 md:w-8 2xl:w-24 h-[90vh]`} // Narrow zone for swipe detection
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onClick={() => setDrawerOpen(true)}
      />
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        {...rest}
        id="drawer-example"
        className={twMerge(baseCSS, animateIn ? 'translate-x-none' : translateClass, rest.className)}
        tabIndex={-1}
        aria-labelledby="drawer-label"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {children}
      </div>
    </div>
  );
};
