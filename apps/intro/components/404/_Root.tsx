import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Root = ({ children, ...rest }: RootProps) => {
  const baseCSS = 'xl:absolute xl:bottom-0 xl:right-0 overflow-hidden';
  return (
    <div {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </div>
  );
};
