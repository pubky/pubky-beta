'use client';

import { Icon, Typography } from '@social/ui-shared';
import React, { useRef, useEffect } from 'react';
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
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const baseCSS =
    'max-h-screen overflow-y-auto min-h-[420px] relative w-full bg-[#05050a] rounded-t-3xl mx-1 px-6 pb-24 border border-white border-opacity-20';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bottomSheetRef.current &&
        !bottomSheetRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, setShow]);

  if (!show) return null;

  return (
    <div
      {...rest}
      className="fixed inset-0 bg-transparent z-50 flex items-end"
      onClick={() => setShow(false)}
    >
      <div
        ref={bottomSheetRef}
        className={twMerge(baseCSS, rest.className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onClick={() => setShow(false)}
          className="flex items-center mt-2 mb-6 justify-center cursor-pointer"
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
