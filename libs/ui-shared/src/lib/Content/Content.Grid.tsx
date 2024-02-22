import { twMerge } from 'tailwind-merge';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Grid = ({ children, ...rest }: GridProps) => {
  const baseCSS = 'max-w-[1200px] justify-start items-start my-0 mx-auto';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
};
