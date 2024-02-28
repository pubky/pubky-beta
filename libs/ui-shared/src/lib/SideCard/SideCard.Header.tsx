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
    <div className="w-96 justify-between items-center inline-flex">
      <HeaderTitle variant={variantTitle}>{title}</HeaderTitle>
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
