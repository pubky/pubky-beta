import { twMerge } from 'tailwind-merge';
import { ImageByUri } from '../../../../../apps/web/components/ImageByUri/index';

type ImageProps = {
  width?: number;
  height?: number;
  alt: string;
  uriImage: string;
  className?: string;
};

export const ImageUser = ({
  width = 32,
  height = 32,
  alt = 'userpic',
  uriImage,
  ...rest
}: ImageProps) => {
  return (
    <ImageByUri
      {...rest}
      width={width}
      height={height}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={twMerge(`rounded-full`, rest.className)}
      alt={alt}
      uri={uriImage}
    />
  );
};
