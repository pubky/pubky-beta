'use client';

import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { Typography } from '../Typography';
import { Utils } from '@social/utils-shared';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string;
  borderRadius?: string;
  children?: React.ReactNode;
  postId?: string;
}

const UNBLURRED_POSTS_KEY = 'unblurred_posts';

export const MainCard = ({ background = '', borderRadius = '', children, postId, ...rest }: CardProps) => {
  const baseCSS = `relative w-full p-6 shadow bg-white bg-opacity-10 rounded-lg flex-col justify-between inline-flex`;

  return (
    <Card.Primary
      {...rest}
      borderRadius={borderRadius}
      background={background}
      className={twMerge(baseCSS, rest.className)}
    >
      {children}
    </Card.Primary>
  );
};
