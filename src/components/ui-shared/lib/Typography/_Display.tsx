import { twMerge } from 'tailwind-merge';

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string | React.ReactNode;
}

export const Display = ({ children, ...rest }: DisplayProps) => {
  const baseCSS = `text-[48px] leading-[2.6rem] font-bold font-InterTight text-white`;
  const responsiveCSS = 'sm:text-[50px] md:text-[60px] xl:text-[64px] sm:leading-normal';
  return (
    <h1 {...rest} className={twMerge(baseCSS, responsiveCSS, rest.className)}>
      {children}
    </h1>
  );
};
