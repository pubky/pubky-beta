import React, { ReactNode } from 'react';

interface BackgroundImageProps {
  children: ReactNode;
  src?: string;
  backgroundColor?: string;
}

const BackgroundImage = ({
  children,
  src,
  backgroundColor = '#0e0e18',
}: BackgroundImageProps) => {
  return (
    <div
      className="w-full relative"
      style={{
        backgroundImage: `linear-gradient(to bottom right, black, ${backgroundColor})`,
      }}
    >
      {children}
      {src && (
        <img
          src={src}
          alt="Background Image"
          className="absolute bottom-0 right-0 max-w-[50%] max-h-[50%] z-0"
        />
      )}
    </div>
  );
};

export default BackgroundImage;
