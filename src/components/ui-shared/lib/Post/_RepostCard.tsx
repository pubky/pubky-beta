import { twMerge } from 'tailwind-merge';

interface RepostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const RepostCard = ({ children, ...rest }: RepostCardProps) => {
  const baseCSS = 'px-6 py-3 rounded-tl-2xl rounded-tr-2xl items-start flex justify-between bg-white bg-opacity-5';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
};
