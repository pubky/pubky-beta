import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

type ImageProps = {
  width?: number;
  height?: number;
  alt: string;
  src: string;
  className?: string;
};

export const ImageUser = ({
  width = 32,
  height = 32,
  alt = 'userpic',
  src,
  ...rest
}: ImageProps) => {
  return (
    <Image
      {...rest}
      width={width}
      height={height}
      className={twMerge(
        `rounded-full w-[${width}px] h-[${height}px]`,
        rest.className
      )}
      alt={alt}
      src={src}
    />
  );
};
