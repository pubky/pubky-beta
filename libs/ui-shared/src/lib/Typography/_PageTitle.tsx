import { twMerge } from 'tailwind-merge';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string | React.ReactNode;
}

export const PageTitle = ({
  color = 'text-white',
  children,
  ...rest
}: PageTitleProps) => {
  const responsiveCSS = 'sm:text-3xl sm:leading-snug';
  const baseCSS = `text-lg leading-5 font-light font-InterTight text-white`;
  return (
    <h2 {...rest} className={twMerge(baseCSS, responsiveCSS, rest.className)}>
      {children}
    </h2>
  );
};
