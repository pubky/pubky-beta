import React from 'react';

interface OnBoardingTitleProps {
  color?: string;
  children: string;
  styles?: string;
}

export const OnBoardingTitle = ({
  color = 'text-white',
  children,
  styles,
  ...props
}: OnBoardingTitleProps) => {
  const textColor = `${color}`;

  return (
    <h1
      className={`font-inter-tight text-[100px] font-bold leading-[120px] tracking-tighter ${textColor} ${styles}`}
      {...props}
    >
      {children}
    </h1>
  );
};
