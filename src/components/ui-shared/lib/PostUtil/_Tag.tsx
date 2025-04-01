'use client';

import React, { useState } from 'react';
import { Typography } from '../Typography';
import { twMerge } from 'tailwind-merge';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  clicked: boolean;
  color?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  boxShadow?: boolean;
}

const hexToRgba = (hex: string, alpha: number) => {
  const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const Tag = ({
  id,
  clicked = false,
  color = 'fuchsia',
  children,
  action,
  boxShadow = true,
  ...rest
}: TagProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isCustomColor = color && !['fuchsia'].includes(color);

  let cssClasses = clicked ? 'border-opacity-60' : 'border-transparent';
  let cssText = 'text-white';
  let style: React.CSSProperties = {};

  if (isCustomColor) {
    style = clicked
      ? {
          backgroundColor: hexToRgba(color, 0.3),
          borderColor: hexToRgba(color, 1)
        }
      : {
          backgroundColor: hexToRgba(color, 0.3),
          borderColor: 'transparent'
        };

    if (!clicked && isHovered) {
      if (boxShadow) {
        style.boxShadow = `inset 0 0 10px 2px ${hexToRgba(color, 1)}`;
      } else {
        style.backgroundColor = hexToRgba(color, 0.6);
      }
    }

    cssText = 'text-white';
  } else {
    switch (color) {
      case 'fuchsia':
        cssClasses = clicked
          ? 'bg-white bg-opacity-20 border-white border-opacity-60'
          : 'bg-white bg-opacity-10 border-transparent hover:bg-opacity-60';
        cssText = 'text-fuchsia-200';
        break;
    }
  }

  return (
    <div
      id={id}
      {...rest}
      className={twMerge(
        `inline-flex border h-8 px-3 py-1 rounded-lg cursor-pointer text-center transition-all duration-300`,
        cssClasses,
        rest.className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-2 whitespace-nowrap">
        <Typography.Body className={cssText} variant="small-bold">
          {children}
        </Typography.Body>
        {action}
      </div>
    </div>
  );
};
