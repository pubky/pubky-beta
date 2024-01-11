import React from 'react';

interface CardProps {
  height?: string;
  styles?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const Card = ({
  height,
  styles,
  title,
  subtitle,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={`w-[384px] ${height} z-10 p-[32px] rounded-[16px] border border-solid ${styles} border-[#FFFFFF29] shadow-xl bg-gradient-to-b from-[#07040a] to-[#1b1820] opacity-90`}
      {...props}
    >
      <div>
        {title && (
          <h2 className="text-[#FFFFFF] font-inter-tight font-semibold text-2xl leading-[30px] tracking-[0.6px] mb-[24px]">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-[#FFFFFFCC] font-inter-tight font-light text-[17px] leading-[22px] tracking-[0.4px] mb-10">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};
