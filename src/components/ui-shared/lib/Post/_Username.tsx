import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface UsernameProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}
export const Username = ({ children, ...rest }: UsernameProps) => {
  return (
    <Typography.Body {...rest} className={twMerge(rest.className)} variant="medium-bold">
      {children}
    </Typography.Body>
  );
};
