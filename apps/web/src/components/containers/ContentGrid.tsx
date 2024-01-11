import React from 'react';

interface ContentGridProps {
  children: React.ReactNode;
  height?: string;
}

const ContentGrid = ({ children, height }: ContentGridProps) => {
  return (
    <div
      className={`max-w-[1200px] justify-start items-start my-0 mx-auto ${height}`}
    >
      {children}
    </div>
  );
};

export default ContentGrid;
