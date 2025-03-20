import { twMerge } from 'tailwind-merge';
import { ImageByUri } from '@components/ImageByUri/index';

type ImageProps = {
  id?: string;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
};

export const ImageUser = ({ id, width = 32, height = 32, alt = 'userpic', ...rest }: ImageProps) => {
  return (
    <ImageByUri
      {...rest}
      id={id}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={twMerge(`rounded-full`, rest.className)}
      alt={alt}
    />
  );
};
