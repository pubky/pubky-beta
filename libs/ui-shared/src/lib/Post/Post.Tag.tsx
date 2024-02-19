'use client';

import { useState } from 'react';
import { Typography } from '../Typography';

type TagProps = {
  children: string;
  color?: string;
  styles?: string;
  className?: string;
};

export const Tag = ({ styles, color, children, ...props }: TagProps) => {
  const [clicked, setClicked] = useState(false);

  let backgroundColor = clicked
    ? 'bg-white bg-opacity-20 border border-white'
    : 'bg-white bg-opacity-20 hover:bg-opacity-30';

  switch (color) {
    case 'yellow':
      backgroundColor = clicked
        ? 'bg-yellow-400 bg-opacity-30 border border-yellow-400'
        : 'bg-yellow-400 bg-opacity-30 hover:bg-opacity-60';
      break;
    case 'amber':
      backgroundColor = clicked
        ? 'bg-amber-500 bg-opacity-30 border border-amber-500'
        : 'bg-amber-500 bg-opacity-30 hover:bg-opacity-60';
      break;
    case 'red':
      backgroundColor = clicked
        ? 'bg-red-600 bg-opacity-30 border border-red-600'
        : 'bg-red-600 bg-opacity-30 hover:bg-opacity-60';
      break;
    case 'fuchsia':
      backgroundColor = clicked
        ? 'bg-fuchsia-500 bg-opacity-30 border border-fuchsia-500'
        : 'bg-fuchsia-500 bg-opacity-30 hover:bg-opacity-60';
      break;
    case 'blue':
      backgroundColor = clicked
        ? 'bg-blue-600 bg-opacity-30 border border-blue-600'
        : 'bg-blue-600 bg-opacity-30 hover:bg-opacity-60';
      break;
    case 'cyan':
      backgroundColor = clicked
        ? 'bg-cyan-400 bg-opacity-30 border border-cyan-400'
        : 'bg-cyan-400 bg-opacity-30 hover:bg-opacity-60';
      break;
    case 'green':
      backgroundColor = clicked
        ? 'bg-green-500 bg-opacity-30 border border-green-500'
        : 'bg-green-500 bg-opacity-30 hover:bg-opacity-60';
      break;
  }

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <button
      onClick={handleClick}
      className={`${backgroundColor} h-8 px-3 py-1 rounded-lg cursor-pointer ${styles}`}
      {...props}
    >
      <Typography.Body variant="small-bold">{children}</Typography.Body>
    </button>
  );
};
