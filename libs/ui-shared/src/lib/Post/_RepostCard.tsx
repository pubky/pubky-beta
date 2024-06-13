import { twMerge } from 'tailwind-merge';

interface RepostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const RepostCard = ({ children, ...rest }: RepostCardProps) => {
  const baseCSS = 'px-11 pb-1 justify-start items-center gap-2 flex';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
};
