import { twMerge } from 'tailwind-merge';

interface PostsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function PostsLayout({ children, ...rest }: PostsLayoutProps) {
  return (
    <>
      <div {...rest} className={twMerge(rest.className)}>
        {children}
      </div>
    </>
  );
}
