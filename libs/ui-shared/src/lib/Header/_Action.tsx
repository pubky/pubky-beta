import Link from 'next/link';
import { Button } from '../Button';

interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  link?: string;
  children: string;
  icon?: React.ReactElement;
}

export const Action = ({
  link = '/sign-in',
  children,
  icon,
  ...rest
}: ActionProps) => {
  return (
    <Link href={link}>
      <Button.Large
        icon={icon}
        className="h-[48px]"
        {...rest}
        variant="secondary"
      >
        {children}
      </Button.Large>
    </Link>
  );
};
