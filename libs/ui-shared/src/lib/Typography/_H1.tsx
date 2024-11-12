import { twMerge } from 'tailwind-merge';

interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string | React.ReactNode;
}

export const H1 = ({ children, ...rest }: H1Props) => {
  return (
    <h1
      {...rest}
      className={twMerge(
        `text-[38px] font-semibold font-InterTight tracking-wide leading-tight text-white`,
        rest.className
      )}
    >
      {children}
    </h1>
  );
};
