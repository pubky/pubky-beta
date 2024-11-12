import { Typography } from '@social/ui-shared';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  variant?: 'bookmark' | 'pubky' | 'link' | 'text';
}

export const Toast = ({
  icon,
  title,
  children,
  variant = 'link',
  ...rest
}: MessageProps) => {
  const baseCSS = `z-50 w-[400px] md:w-[792px] fixed bottom-0 left-1/2 transform -translate-x-1/2 p-6 bg-[#05050a] bg-opacity-60 rounded-tl-2xl rounded-tr-2xl shadow border-l border-r border-t border-white border-opacity-30 backdrop-blur-[50px] justify-start items-center gap-3 inline-flex`;

  return (
    <div id="toast" {...rest} className={twMerge(baseCSS, rest.className)}>
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-3 inline-flex">
        <div className="justify-start items-center gap-2 inline-flex">
          {icon}
          <Typography.H2>{title}</Typography.H2>
        </div>
        <Typography.Body
          className="text-opacity-80 break-words"
          variant="medium-light"
        >
          {children}
        </Typography.Body>
      </div>
    </div>
  );
};

export default Toast;
