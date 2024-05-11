import { twMerge } from 'tailwind-merge';
import { HeaderTitle } from './SideCard.HeaderTitle';

interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  title: string;
  children?: React.ReactNode;
  variantTitle?: 'normal' | 'label';
}
export const Header = ({
  title,
  children,
  variantTitle = 'normal',
  ...rest
}: HeaderProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        'w-full justify-between items-center inline-flex',
        rest.className
      )}
    >
      <HeaderTitle variant={variantTitle}>{title}</HeaderTitle>
      <div className="flex-col justify-start mt-2 items-start inline-flex">
        {children}
      </div>
    </div>
  );
};
