import { ImageByUri } from '../../../../../apps/web/components/ImageByUri/index';
import Image from 'next/image';

import { twMerge } from 'tailwind-merge';
import { PostUtil } from '../PostUtil';
// import { PostUtil } from '../PostUtil';

type Image = {
  uriImage: string;
  width?: number;
  height?: number;
  alt?: string;
  notifications?: number;
  className?: string;
};

export const ImageMenu = ({
  uriImage,
  width = 48,
  height = 48,
  alt = 'user-pic',
  notifications,
  ...rest
}: Image) => {
  return (
    <div className="w-[48px]">
      {notifications && (
        <PostUtil.Counter className="absolute text-center top-6 right-6 bg-black bg-opacity-60 border-white border-opacity-100">
          {notifications}
        </PostUtil.Counter>
      )}
      <ImageByUri
        {...rest}
        width={48}
        height={48}
        className={twMerge(`rounded-full w-[48px] h-[48px]`, rest.className)}
        alt="user-pic"
        uri={uriImage}
      />
    </div>
  );
};
