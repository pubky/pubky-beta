import React from 'react';

interface QrProps {
  url: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

const Qr = ({
  url,
  width = '100%',
  height = '100%',
  borderRadius = '0px',
}: QrProps) => {
  const imageStyle: React.CSSProperties = {
    maxWidth: width,
    maxHeight: height,
    borderRadius: borderRadius,
  };

  return <img src={url} alt="qr image" style={imageStyle} />;
};

export default Qr;
