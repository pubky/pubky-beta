import Link from 'next/link';
import { Button } from '../Button';

interface ActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  link?: string;
  children: string;
}

export const Action = ({
  link = '/sign-in',
  children,
  ...rest
}: ActionProps) => {
  return (
    <Link href={link}>
      <Button.Large {...rest} variant="secondary">
        {children}
      </Button.Large>
    </Link>
  );
};
