import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Root = ({ children, ...rest }: RootProps) => {
  return (
    <div {...rest} className={twMerge(`flex-col gap-6 flex`, rest.className)}>
      {children}
    </div>
  );
};
