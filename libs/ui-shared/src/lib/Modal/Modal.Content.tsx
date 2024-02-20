import React from 'react';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Content = ({ children, ...rest }: ContentProps) => {
  return (
    <div className="grid grid-cols-3 gap-6" {...rest}>
      {children}
    </div>
  );
};
