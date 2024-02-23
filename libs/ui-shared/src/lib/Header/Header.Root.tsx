import { twMerge } from 'tailwind-merge';

interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

export const Root = ({ children, ...rest }: HeaderRootProps) => {
  const baseCSS =
    'max-w-[1200px] bg-transparent bg-opacity-50 mx-auto py-12 gap-6 flex items-center justify-between';

  return (
    <header
      className={twMerge(
        'sticky top-0 z-20 backdrop-blur-[80px]',
        rest.className
      )}
    >
      <div {...rest} className={twMerge(baseCSS, rest.className)}>
        {children}
      </div>
    </header>
  );
};
