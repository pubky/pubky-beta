import { twMerge } from 'tailwind-merge';

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: string | React.ReactNode;
}

export const Display = ({ children, ...rest }: DisplayProps) => {
  return (
    <h1
      {...rest}
      className={twMerge(
        `text-[100px] font-bold font-['Inter Tight'] text-white`,
        rest.className
      )}
    >
      {children}
    </h1>
  );
};
