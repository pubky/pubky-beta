import { twMerge } from 'tailwind-merge';

interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Root = ({ children, ...rest }: HeaderRootProps) => {
  const responsiveCSS =
    'sm:max-w-[600px] md:max-w-[730px] lg:max-w-[1000px] xl:max-w-[1200px] sm:h-[144px]';
  const baseCSS =
    'max-w-[280px] h-3.5 bg-transparent bg-opacity-50 mx-auto py-12 gap-6 flex items-center justify-between';

  return (
    <div
      className={twMerge(
        'sticky top-0 z-20 backdrop-blur-[80px]',
        rest.className
      )}
    >
      <header
        {...rest}
        className={twMerge(baseCSS, responsiveCSS, rest.className)}
      >
        {children}
      </header>
    </div>
  );
};
