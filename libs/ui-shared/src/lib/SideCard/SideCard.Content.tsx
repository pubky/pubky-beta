import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Content = ({ children, ...rest }: ContentProps) => {
  return (
    <Card.Primary {...rest} className={twMerge(`w-96 mt-4`, rest.className)}>
      {children}
    </Card.Primary>
  );
};
