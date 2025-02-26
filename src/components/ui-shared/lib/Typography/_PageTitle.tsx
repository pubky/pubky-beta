import { twMerge } from 'tailwind-merge';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string | React.ReactNode;
}

export const PageTitle = ({ color = 'text-white', children, ...rest }: PageTitleProps) => {
  const responsiveCSS = 'sm:text-3xl sm:leading-snug';
  const baseCSS = `text-white text-opacity-50 text-3xl font-light font-InterTight leading-[30px]`;
  return (
    <h2 {...rest} className={twMerge(baseCSS, responsiveCSS, rest.className)}>
      {children}
    </h2>
  );
};
