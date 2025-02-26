import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children?: React.ReactNode;
  background?: string;
}

export const Content = ({ id, children, background = 'bg-transparent', ...rest }: ContentProps) => {
  return (
    <Card.Primary
      {...rest}
      id={id}
      background={background}
      className={twMerge(`w-full mt-4 border-none p-0`, rest.className)}
    >
      {children}
    </Card.Primary>
  );
};
