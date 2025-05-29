'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string;
  borderRadius?: string;
  isCensored?: boolean;
  children?: React.ReactNode;
}

export const MainCard = ({ background = '', borderRadius = '', children, isCensored, ...rest }: CardProps) => {
  const [isUnblurred, setIsUnblurred] = useState(false);
  const censored = !isUnblurred && isCensored;
  const baseCSS = `relative w-full p-6 shadow bg-white bg-opacity-10 rounded-lg flex-col justify-between inline-flex`;

  const handleUnblur = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsUnblurred(true);
  };

  return (
    <>
      <Card.Primary
        {...rest}
        borderRadius={borderRadius}
        background={background}
        className={twMerge(baseCSS, censored && 'blur-sm', rest.className)}
      >
        {children}
      </Card.Primary>
      {censored && (
        <div
          className="absolute inset-0 top-2 flex flex-col items-center justify-center cursor-pointer opacity-30 hover:opacity-100 transition-opacity duration-300 z-10"
          onClick={handleUnblur}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Icon.EyeSlash size="32px" color="white" />
            <Typography.Body variant="small" className="text-center text-white">
              This post may contain sexually explicit content
            </Typography.Body>
          </div>
        </div>
      )}
    </>
  );
};
