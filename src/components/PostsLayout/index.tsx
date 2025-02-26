import { twMerge } from 'tailwind-merge';

interface PostsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}

export default function PostsLayout({ children, ref, ...rest }: PostsLayoutProps) {
  return (
    <div {...rest} ref={ref} className={twMerge(rest.className)}>
      {children}
    </div>
  );
}
