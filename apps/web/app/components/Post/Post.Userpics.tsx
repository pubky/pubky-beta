import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface UserpicsProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { alt: string; src: string }[];
  className?: string;
}

export const Userpics = ({ images, ...rest }: UserpicsProps) => {
  const baseCSS = 'justify-start items-start inline-flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {images &&
        images.map((image, index) => (
          <Image
            width={32}
            height={32}
            key={index}
            className={`rounded-full shadow justify-center items-center flex ${
              index > 0 && '-ml-2'
            }`}
            alt={image.alt ? image.alt : `image-${index + 1}`}
            src={image.src}
          />
        ))}
    </div>
  );
};
