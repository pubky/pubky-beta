import { twMerge } from 'tailwind-merge';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Grid = ({ children, ...rest }: GridProps) => {
  const baseCSS =
    'max-w-[380px] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1200px] w-full pb-12 m-auto px-3';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
};
