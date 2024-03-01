import { twMerge } from 'tailwind-merge';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Grid = ({ children, ...rest }: GridProps) => {
  const responsiveCSS =
    'sm:max-w-[600px] md:max-w-[730px] lg:max-w-[1000px] xl:max-w-[1200px] sm:py-12';
  const baseCSS = 'max-w-[280px] py-6 m-auto';
  return (
    <div {...rest} className={twMerge(baseCSS, responsiveCSS, rest.className)}>
      {children}
    </div>
  );
};
