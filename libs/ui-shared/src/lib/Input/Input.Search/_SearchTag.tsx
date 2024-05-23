import { twMerge } from 'tailwind-merge';
import { Typography } from '../../Typography';
import React from 'react';

interface SearchTagProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  color: string;
  actions: React.ReactNode[];
}

export const SearchTag = ({
  value,
  color = 'bg-black',
  actions,
  ...rest
}: SearchTagProps) => {
  const baseCSS = `cursor-pointer items-center px-2 py-1 backdrop-blur-lg justify-start gap-1 inline-flex rounded-lg`;

  return (
    <div {...rest} className={twMerge(baseCSS, color, rest.className)}>
      <Typography.Body variant="small-bold">{value}</Typography.Body>
      {actions.map((action, index) => (
        <div key={index}>{action}</div>
      ))}
    </div>
  );
};
