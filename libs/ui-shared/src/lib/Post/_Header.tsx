import { twMerge } from 'tailwind-merge';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Header = ({ children, ...rest }: HeaderProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        `pb-6 justify-start items-start inline-flex`,
        rest.className
      )}
    >
      {children}
    </div>
  );
};
