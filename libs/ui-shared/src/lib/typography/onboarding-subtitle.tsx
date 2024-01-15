import React from 'react';

interface OnBoardingSubTitleProps {
  color?: string;
  children: string;
  styles?: string;
  id?: string;
}

export const OnBoardingSubTitle = ({
  color = 'text-white',
  children,
  styles,
  ...props
}: OnBoardingSubTitleProps) => {
  const textColor = `${color}`;

  return (
    <h2
      className={`font-inter-tight text-[30px] font-light leading-[30px] mt-6 mb-12 tracking-[-0.3px] text-opacity-50 ${textColor} ${styles}`}
      {...props}
    >
      {children}
    </h2>
  );
};
