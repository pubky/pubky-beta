import { twMerge } from 'tailwind-merge';

interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Root = ({ children, ...rest }: HeaderRootProps) => {
  const baseCSS =
    'sticky top-0 z-50 bg-transparent bg-opacity-50 backdrop-blur-[80px] max-w-[1500px] max-h-36 mx-auto py-12 px-40 gap-6 flex items-center justify-between';

  return (
    <header {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </header>
  );
};
