import { Typography } from '../../../Typography';
import { twMerge } from 'tailwind-merge';

interface CounterProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: number;
}

export const Counter = ({ children, ...rest }: CounterProps) => {
  return (
    <Typography.Caption className={twMerge('text-opacity-50', rest.className)} variant="bold">
      {children}
    </Typography.Caption>
  );
};
