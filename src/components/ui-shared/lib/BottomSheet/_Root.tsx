'use client';

import { Icon, Typography } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface RootBottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  children?: React.ReactNode;
  homeIndicatorCSS?: string;
  fixed?: boolean;
}

export default function Root({
  show,
  setShow,
  title,
  children,
  homeIndicatorCSS,
  fixed = false,
  ...rest
}: RootBottomSheetProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);

  const baseCSS =
    'max-h-[90vh] overflow-y-auto min-h-[250px] relative w-full bg-[#05050a] rounded-t-3xl mx-1 px-6 pb-12 border border-white border-dashed border-opacity-30 z-50 transition-transform duration-300 touch-action-none';

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
      return () => {
        clearTimeout(timeout);
        document.body.classList.remove('overflow-hidden');
      };
    }
  }, [show]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (fixed) return;

    const touchY = e.touches[0].clientY;
    const sheet = document.getElementById('bottom-sheet-content');
    if (!sheet) return;

    const sheetRect = sheet.getBoundingClientRect();
    const homeIndicatorHeight = 20; // Approximate height of home indicator area

    // Only allow swipe down if touch started from home indicator area or outside the sheet
    if (touchY <= sheetRect.top + homeIndicatorHeight) {
      setStartY(touchY);
    } else {
      setStartY(null);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (fixed || startY === null) return;

    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    if (diffY > 100) {
      e.preventDefault();
      setShow(false);
    }
  };

  useEffect(() => {
    const sheet = document.getElementById('bottom-sheet');
    if (!sheet) return;

    sheet.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      sheet.removeEventListener('touchmove', handleTouchMove);
    };
  }, [startY]);

  if (!isVisible) return null;

  return (
    <div
      id="bottom-sheet"
      {...rest}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
      onClick={fixed ? undefined : () => setShow(false)}
      onTouchStart={handleTouchStart}
    >
      <div
        id="bottom-sheet-content"
        className={twMerge(baseCSS, animateIn ? 'translate-y-none' : 'translate-y-full', rest.className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={fixed ? undefined : () => setShow(false)}
          className={twMerge('flex items-center mt-2 mb-4 justify-center cursor-pointer z-50', homeIndicatorCSS)}
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
