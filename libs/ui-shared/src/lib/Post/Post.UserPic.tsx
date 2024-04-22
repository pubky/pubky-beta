import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface UserPicProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { alt: string; src: string }[];
  className?: string;
}

export const UserPic = ({ images, ...rest }: UserPicProps) => {
  const baseCSS = 'flex justify-center items-center gap-1 flex-wrap';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {images &&
        images.map((image, index) => (
          <Image
            width={32}
            height={32}
            key={index}
            className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
              index > 0 && '-ml-2'
            }`}
            alt={image.alt ? image.alt : `image-${index + 1}`}
            src={image.src}
          />
        ))}
    </div>
  );
};
