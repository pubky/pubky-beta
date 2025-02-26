import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface LabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  value: string;
}

export const Label = ({ value, ...rest }: LabelProps) => {
  const baseCSS = 'text-opacity-30 mb-2';

  return <Typography.Label className={twMerge(baseCSS, rest.className)}>{value}</Typography.Label>;
};
