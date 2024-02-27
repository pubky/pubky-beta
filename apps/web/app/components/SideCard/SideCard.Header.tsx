import { Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  children?: React.ReactNode;
}
export const Header = ({ title, children, ...rest }: HeaderProps) => {
  return (
    <div className="w-96 justify-between items-center inline-flex">
      <Typography.Body variant="large-bold">{title}</Typography.Body>
      <div
        {...rest}
        className={twMerge(
          `flex-col justify-start mt-2 items-start inline-flex`,
          rest.className
        )}
      >
        {children}
      </div>
    </div>
  );
};
