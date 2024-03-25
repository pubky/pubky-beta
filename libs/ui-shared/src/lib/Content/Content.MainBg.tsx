import { twMerge } from 'tailwind-merge';

interface MainBgProps {
  imgSrc: string;
  alt: string;
  className?: string;
}

export const MainBg = ({ imgSrc, alt, className }: MainBgProps) => {
  const baseCSS = `absolute bottom-0 right-0 max-w-[50%] max-h-[50%]`;

  return <img src={imgSrc} alt={alt} className={twMerge(baseCSS, className)} />;
};
