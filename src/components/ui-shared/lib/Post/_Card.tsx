import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string;
  borderRadius?: string;
  children?: React.ReactNode;
}

export const MainCard = ({ background = '', borderRadius = '', children, ...rest }: CardProps) => {
  const baseCSS = `relative w-full p-6 shadow bg-white bg-opacity-10 rounded-lg flex-col justify-between inline-flex`;
  return (
    <Card.Primary
      {...rest}
      borderRadius={borderRadius}
      background={background}
      className={twMerge(baseCSS, rest.className)}
    >
      {children}
    </Card.Primary>
  );
};
