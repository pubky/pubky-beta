import { ImageByUri } from '@components/ImageByUri/index';
import { twMerge } from 'tailwind-merge';

interface UserPicProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { id: string; alt: string }[];
  className?: string;
}

export const UserPic = ({ images, ...rest }: UserPicProps) => {
  const baseCSS = 'flex justify-start items-start gap-1 flex-wrap';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {images &&
        images.map((image, index) => (
          <ImageByUri
            id={image.id}
            width={32}
            height={32}
            key={index}
            className={`w-[32px] h-[32px] min-w-[32px] min-h-[32px] rounded-full shadow justify-center items-center flex object-cover flex-shrink-0 ${index > 0 && '-ml-2'}`}
            alt={image.alt ? image.alt : `image-${index + 1}`}
          />
        ))}
    </div>
  );
};
