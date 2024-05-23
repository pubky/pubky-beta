import { Card } from '../Card';
import { Title } from './_Title';

import { twMerge } from 'tailwind-merge';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  isOpen: boolean;
}

export const Content = ({
  title,
  subtitle,
  children,
  isOpen = false,
  ...rest
}: ContentProps) => {
  const baseCSS = `w-[336px] bg-gradient-to-t from-[#07040a] to-[#1b1820] mt-4 absolute z-10 p-12 opacity-100 border border-fuchsia-600 border-opacity-30`;

  return (
    <div>
      {isOpen && (
        <Card.Primary className={twMerge(baseCSS, rest.className)}>
          {title && <Title title={title} subtitle={subtitle} />}
          {children}
        </Card.Primary>
      )}
    </div>
  );
};
