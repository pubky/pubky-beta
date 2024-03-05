import { twMerge } from 'tailwind-merge';

interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Root = ({ children, ...rest }: HeaderRootProps) => {
  const baseCSS =
    'w-full max-w-[380px] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[900px] xl:max-w-[1200px] h-3.5 sm:h-[144px] bg-transparent bg-opacity-50 mx-auto py-12 gap-6 flex items-center justify-between';

  return (
    <div
      className={twMerge(
        'sticky top-0 z-20 backdrop-blur-[80px]',
        rest.className
      )}
    >
      <header {...rest} className={twMerge(baseCSS, rest.className)}>
        {children}
      </header>
    </div>
  );
};
