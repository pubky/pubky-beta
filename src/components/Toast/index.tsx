'use client';

import { ToastVariant } from '@/contexts/_toast';
import { Typography } from '@social/ui-shared';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  variant?: ToastVariant;
}

export const Toast = ({ icon, title, children, variant = 'link', ...rest }: MessageProps) => {
  const [animateIn, setAnimateIn] = useState(false);
  const baseCSS = `z-50 w-full md:w-[792px] fixed bottom-0 left-1/2 transform -translate-x-1/2 p-6 bg-[#c8ff00]/10 rounded-tl-2xl rounded-tr-2xl shadow-[0px_50px_100px_0px_rgba(0,0,0,1.00)] backdrop-blur-[50px] justify-start items-center gap-3 inline-flex transition-transform duration-300`;

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 10);
    const timeoutId = setTimeout(() => setAnimateIn(false), 3700);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      id="toast"
      {...rest}
      className={twMerge(baseCSS, animateIn ? 'translate-y-none' : 'translate-y-full', rest.className)}
    >
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
        <div className="justify-start items-center gap-2 inline-flex">
          {icon}
          <Typography.H2 className="text-[#c8ff00]">{title}</Typography.H2>
        </div>
        <Typography.Body className="text-opacity-80 break-words text-[#c8ff00]" variant="medium-light">
          {children}
        </Typography.Body>
      </div>
    </div>
  );
};

export default Toast;
