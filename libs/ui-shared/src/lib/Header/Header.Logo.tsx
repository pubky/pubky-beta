import Link from 'next/link';
import { Icon } from '../Icon';

interface HeaderLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  link?: string;
}

export const Logo = ({ link = '/', ...rest }: HeaderLogoProps) => {
  return (
    <Link {...rest} href={link}>
      <Icon.Pubky />
    </Link>
  );
};
