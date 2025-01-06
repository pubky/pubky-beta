'use client';

import { Icon, Typography } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RootBottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  children?: React.ReactNode;
}

export default function Root({
  show,
  setShow,
  title,
  children,
  ...rest
}: RootBottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);

  const baseCSS =
    'max-h-[90vh] overflow-y-auto min-h-[420px] relative w-full bg-[#05050a] rounded-t-3xl mx-1 px-6 pb-24 border border-white border-opacity-20 z-50 transition-transform duration-300 touch-action-none';

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      document.body.classList.add('overflow-hidden');
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        document.body.classList.remove('overflow-hidden');
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;

    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    if (diffY > 100) {
      e.preventDefault();
      setShow(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      {...rest}
      className="fixed inset-0 bg-transparent z-50 flex items-end"
      onClick={() => setShow(false)}
    >
      <div
        className={twMerge(
          baseCSS,
          animateIn ? 'translate-y-none' : 'translate-y-full',
          rest.className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => setShow(false)}
          className="flex items-center mt-2 mb-6 justify-center cursor-pointer z-50"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <Icon.HomeIndicator color="gray" />
        </div>
        {title && (
          <div className="mb-4">
            <Typography.H2>{title}</Typography.H2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
