import { twMerge } from 'tailwind-merge';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  size?: 'full' | 'normal';
}

export const Header = ({ children, size = 'normal', ...rest }: HeaderProps) => {
  const gap = size === 'full' ? 'xl:gap-14' : '';
  return (
    <div
      {...rest}
      className={twMerge(
        `pb-6 justify-start items-start inline-flex`,
        gap,
        rest.className
      )}
    >
      {children}
    </div>
  );
};
