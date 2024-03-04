import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Typography } from '@social/ui-shared';

interface InfoProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function Info({
  username,
  src,
  alt = 'user-pic',
  width = 240,
  height = 240,
  ...rest
}: InfoProps) {
  const baseCSS =
    'xl:w-[1201px] gap-6 justify-between items-center inline-flex relative z-10';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.Display className="text-2xl leading-none">
        {username}
      </Typography.Display>
      <Image
        alt={alt}
        width={width}
        height={height}
        className="rounded-full scale-50 sm:scale-75"
        src={src}
      />
    </div>
  );
}
