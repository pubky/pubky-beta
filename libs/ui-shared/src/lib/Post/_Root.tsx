import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children?: React.ReactNode;
}

export const Root = ({ href, children, ...rest }: RootProps) => {
  return (
    <a
      href={href}
      {...rest}
      className={twMerge(`flex-col gap-6 flex`, rest.className)}
    >
      {children}
    </a>
  );
};
