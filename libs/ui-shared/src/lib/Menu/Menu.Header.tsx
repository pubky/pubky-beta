import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  username: string;
  handler: string;
  width?: number;
  height?: number;
  alt?: string;
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
    <div
      {...rest}
      className={twMerge('flex-col sm:gap-4 flex', rest.className)}
    >
      <Image
        width={width}
        height={height}
        alt={alt}
        src={src}
        className="rounded-full"
      />
      <div className="flex-col sm:gap-2 flex">
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
    </div>
  );
};
