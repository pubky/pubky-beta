import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface MainBgProps {
  imgSrc: string;
  alt: string;
  className?: string;
}

export const MainBg = ({ imgSrc, alt, className }: MainBgProps) => {
  const baseCSS = `w-[768px] h-[768px] absolute bottom-0 right-0 max-w-[50%] max-h-[50%]`;

  return (
    <div className={twMerge(baseCSS, className)}>
      <Image fill alt={alt} src={imgSrc} />
    </div>
  );
};
