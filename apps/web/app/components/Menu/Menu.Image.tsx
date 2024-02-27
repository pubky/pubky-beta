import Image from 'next/image';
import { PostUtil } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

type Image = {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  notifications?: number;
  className?: string;
};

export const ImageMenu = ({
  src,
  width = 48,
  height = 48,
  alt = 'user-pic',
  notifications,
  ...rest
}: Image) => {
  return (
    <>
      {notifications && (
        <PostUtil.Counter
          className="absolute top-4 right-6 bg-black bg-opacity-60 border-fuchsia-500 border-opacity-100"
          counter={notifications}
        />
      )}
      <Image
        {...rest}
        width={48}
        height={48}
        className={twMerge(`rounded-full`, rest.className)}
        alt="user-pic"
        src="/images/user.png"
      />
    </>
  );
};
