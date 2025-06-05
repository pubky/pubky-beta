import Link from 'next/link';
import { Button } from '../Button';
import { twMerge } from 'tailwind-merge';

interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  link?: string;
  children: string;
  icon?: React.ReactElement;
}

export const Action = ({ link = '/sign-in', children, icon, ...rest }: ActionProps) => {
  const baseCSS = 'h-8 px-3 py-2 sm:h-[48px] sm:px-6 sm:py-5';
  return (
    <Link href={link}>
      <Button.Large icon={icon} className={twMerge(baseCSS, rest.className)} variant="secondary">
        {children}
      </Button.Large>
    </Link>
  );
};
