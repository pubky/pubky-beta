import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface HeaderProps extends React.HTMLAttributes<HTMLAnchorElement> {
  src: string;
  username: string;
  handler?: string;
  width?: number;
  height?: number;
  alt?: string;
  href?: string;
}

export const Header = ({
  src,
  username,
  handler,
  width = 96,
  height = 96,
  alt = 'user-pic',
  ...rest
}: HeaderProps) => {
  return (
    <a {...rest} className={twMerge('flex-col gap-4 flex', rest.className)}>
      <Image
        width={width}
        height={height}
        alt={alt}
        src={src}
        className="rounded-full w-[96px] h-[96px]"
      />
      <div className="flex-col flex">
        <Typography.PageTitle className="font-bold leading-[30px]">
          {username}
        </Typography.PageTitle>
        <div className="items-center gap-1 inline-flex">
          <Typography.Label className="text-opacity-50">
            {handler}
          </Typography.Label>
          <Icon.CheckCircle />
        </div>
      </div>
    </a>
  );
};
