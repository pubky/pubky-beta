import { twMerge } from 'tailwind-merge';

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string | React.ReactNode;
}

export const Display = ({ children, ...rest }: DisplayProps) => {
  const baseCSS = `text-[40px] leading-10 font-bold font-['Inter Tight'] text-white`;
  const responsiveCSS =
    'sm:text-[50px] md:text-[60px] lg:text-[80px] xl:text-[100px] sm:leading-normal';
  return (
    <h1 {...rest} className={twMerge(baseCSS, responsiveCSS, rest.className)}>
      {children}
    </h1>
  );
};
