import { Card } from '../Card';
import { Title } from './_Title';

import { twMerge } from 'tailwind-merge';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  isOpen: boolean;
}

export const Content = ({ title, subtitle, children, isOpen = false, ...rest }: ContentProps) => {
  const baseCSS = `w-[282px] border border-white rounded-2xl border-opacity-30 mt-8 absolute z-10 px-6 pt-3 pb-6 opacity-100`;

  return (
    <div>
      {isOpen && (
        <Card.Primary background="bg-[#05050A]" className={twMerge(baseCSS, rest.className)}>
          {title && <Title title={title} subtitle={subtitle} />}
          {children}
        </Card.Primary>
      )}
    </div>
  );
};
