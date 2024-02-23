import Image from 'next/image';

interface HeaderLogoProps {
  logo?: string;
  link?: string;
  width?: number;
  height?: number;
  className?: string;
}

export const Logo = ({
  logo = '/images/pubky.png',
  link = '/',
  width = 167,
  height = 48,
  className = '',
}: HeaderLogoProps) => {
  return (
    <a href={link}>
      <Image
        src={logo}
        alt="Pubky"
        width={width}
        height={height}
        className={className}
      />
    </a>
  );
};
