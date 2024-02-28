import { twMerge } from 'tailwind-merge';

interface TypesProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Types = ({ children, ...rest }: TypesProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        `justify-start items-center gap-3 flex`,
        rest.className
      )}
    >
      {children}
    </div>
  );
};
