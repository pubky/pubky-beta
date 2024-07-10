import { twMerge } from 'tailwind-merge';
import { Typography } from '../../Typography';
import React from 'react';

interface SearchTagProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  action?: React.ReactNode;
}

export const SearchTag = ({ value, action, ...rest }: SearchTagProps) => {
  const baseCSS = `inline-flex border h-8 px-3 py-1 rounded-lg cursor-pointer text-center bg-[#391941] border-fuchsia-500 border-opacity-60`;

  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <div className="flex gap-2">
        <Typography.Body className="text-fuchsia-200" variant="small-bold">
          {value}
        </Typography.Body>
        {action}
      </div>
    </div>
  );
};
