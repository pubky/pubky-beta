import { twMerge } from 'tailwind-merge';
interface File extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const File = ({ className }: File) => {
  const baseCSS = 'animate-pulse bg-gray-700 rounded-[10px] w-full h-full';
  return <div className={twMerge(baseCSS, className)} />;
};
