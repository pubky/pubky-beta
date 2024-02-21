import { twMerge } from 'tailwind-merge';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string | React.ReactNode;
}

export const PageTitle = ({
  color = 'text-white',
  children,
  ...rest
}: PageTitleProps) => {
  return (
    <h2
      {...rest}
      className={twMerge(
        `text-3xl font-light font-['Inter Tight'] text-white`,
        rest.className
      )}
    >
      {children}
    </h2>
  );
};
