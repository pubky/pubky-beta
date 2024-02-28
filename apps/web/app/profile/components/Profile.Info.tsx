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
    'w-[1201px] h-60 justify-between items-center inline-flex relative z-10';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      <Typography.Display>{username}</Typography.Display>
      <Image
        alt={alt}
        width={width}
        height={height}
        className="rounded-full"
        src={src}
      />
    </div>
  );
}
