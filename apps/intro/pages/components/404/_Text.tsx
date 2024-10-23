import { twMerge } from 'tailwind-merge';

interface TextProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const Text = ({ children, ...rest }: TextProps) => {
  const baseCSS = `font-InterTight font-semibold text-[250px] sm:text-[350px] leading-[318px] text-center text-white text-opacity-20`;
  return (
    <h1 {...rest} className={twMerge(baseCSS, rest.className)}>
      {children}
    </h1>
  );
};
