import Link from 'next/link';
import { Button } from '../Button';

interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  link?: string;
  children: string;
  icon?: React.ReactElement;
}

export const Action = ({ link = '/sign-in', children, icon, ...rest }: ActionProps) => {
  return (
    <Link href={link}>
      <Button.Large icon={icon} className="h-8 px-3 py-2 sm:h-[48px] sm:px-6 sm:py-5" {...rest} variant="secondary">
        {children}
      </Button.Large>
    </Link>
  );
};
