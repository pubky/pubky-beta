import Link from 'next/link';
import { Icon } from '../Icon';

interface HeaderLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  link?: string;
}

export const Logo = ({ link = '/home', ...rest }: HeaderLogoProps) => {
  return (
    <Link id="header-logo" {...rest} className="outline-none" href={link}>
      <Icon.Pubky />
    </Link>
  );
};
