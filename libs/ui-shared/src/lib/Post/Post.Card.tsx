import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string;
  children?: React.ReactNode;
}

export const MainCard = ({
  background = 'bg-white bg-opacity-10',
  children,
  ...rest
}: CardProps) => {
  const baseCSS = 'w-full z-auto border-0';
  return (
    <Card.Primary
      {...rest}
      background={background}
      className={twMerge(baseCSS, rest.className)}
    >
      {children}
    </Card.Primary>
  );
};
