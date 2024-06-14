import { twMerge } from 'tailwind-merge';
import { Card } from '../Card';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  background?: string;
  borderRadius?: string;
  children?: React.ReactNode;
}

export const MainCard = ({
  background = '',
  borderRadius = '',
  children,
  ...rest
}: CardProps) => {
  const baseCSS = `relative -mt-6 w-full z-10 p-6 pr-5 pl-5 shadow border-0 border-b-[1px] border-white border-opacity-10 flex-col justify-between inline-flex`;
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
