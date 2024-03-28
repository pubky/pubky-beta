import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import React from 'react';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string | React.ReactNode;
  children?: React.ReactNode;
}
export const Content = ({ children, text, ...rest }: ContentProps) => {
  return (
    <>
      <Typography.Body
        {...rest}
        className={twMerge(`text-opacity-80`, rest.className)}
        variant="medium"
      >
        {text}
      </Typography.Body>
      {children}
    </>
  );
};
