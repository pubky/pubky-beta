import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children?: React.ReactNode;
}

export const Header = ({ title, children, ...rest }: HeaderProps) => {
  return (
    <div className="flex">
      <Typography.H1>{title}</Typography.H1>
      <div className="ml-4">
        <div {...rest} className={twMerge(`gap-3 flex mt-2`, rest.className)}>
          {children}
        </div>
      </div>
    </div>
  );
};
