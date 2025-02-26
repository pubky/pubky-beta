import { Typography } from '../../../Typography';
import { twMerge } from 'tailwind-merge';

interface LabelProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string;
}

export const Label = ({ children, ...rest }: LabelProps) => {
  return (
    <Typography.Caption className={twMerge('text-opacity-50', rest.className)} variant="bold">
      {children}
    </Typography.Caption>
  );
};
