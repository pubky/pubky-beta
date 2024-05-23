import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  background?: string;
}

export const Content = ({
  children,
  background = 'bg-transparent',
  ...rest
}: ContentProps) => {
  return (
    <Card.Primary
      {...rest}
      background={background}
      className={twMerge(`w-full mt-4 border-none p-0`, rest.className)}
    >
      {children}
    </Card.Primary>
  );
};
