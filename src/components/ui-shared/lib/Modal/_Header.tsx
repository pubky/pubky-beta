import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children?: React.ReactNode;
}

export const Header = ({ id, title, children, ...rest }: HeaderProps) => {
  return (
    <div className="flex">
      <Typography.H1 className="text-2xl md:text-[38px]" id={id}>
        {title}
      </Typography.H1>
      <div className="ml-4">
        <div {...rest} className={twMerge(`gap-3 flex`, rest.className)}>
          {children}
        </div>
      </div>
    </div>
  );
};
