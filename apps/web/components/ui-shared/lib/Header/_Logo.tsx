import Link from 'next/link';
import { Icon } from '../Icon';

interface HeaderLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  link?: string;
}

export const Logo = ({ link = '/home', ...rest }: HeaderLogoProps) => {
  return (
    <Link {...rest} className="xl:-ml-1.5 outline-none" href={link}>
      <Icon.Pubky />
    </Link>
  );
};
