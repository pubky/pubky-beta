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
  isCensored?: boolean;
  children?: React.ReactNode;
  postId?: string;
}

const UNBLURRED_POSTS_KEY = 'unblurred_posts';

export const MainCard = ({ background = '', borderRadius = '', children, isCensored, postId, ...rest }: CardProps) => {
  const [isUnblurred, setIsUnblurred] = useState(false);
  const censored = !isUnblurred && isCensored;
  const baseCSS = `relative w-full p-6 shadow bg-white bg-opacity-10 rounded-lg flex-col justify-between inline-flex`;

  useEffect(() => {
    if (postId && isCensored) {
      const unblurredPosts = (Utils.storage.get(UNBLURRED_POSTS_KEY) as string[]) || [];
      setIsUnblurred(unblurredPosts.includes(postId));
    }
  }, [postId, isCensored]);

  const handleUnblur = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (postId) {
      const unblurredPosts = (Utils.storage.get(UNBLURRED_POSTS_KEY) as string[]) || [];
      if (!unblurredPosts.includes(postId)) {
        Utils.storage.set(UNBLURRED_POSTS_KEY, [...unblurredPosts, postId]);
      }
    }
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
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 rounded-lg"
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
