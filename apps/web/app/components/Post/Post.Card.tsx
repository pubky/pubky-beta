import { Card } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string;
  children?: React.ReactNode;
}

export const MainCard = ({
  background = 'bg-white bg-opacity-10',
  children,
  ...rest
}: CardProps) => {
  const baseCSS = 'bg-white bg-opacity-10 w-[792px] z-auto border-0';
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
