import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'light' | 'label';
  children: string;
}
export const HeaderTitle = ({ variant = 'light', children, ...rest }: HeaderTitleProps) => {
  return variant === 'light' ? (
    <Typography.H2
      {...rest}
      variant="light"
      className={twMerge(
        `text-white/50 text-2xl font-light font-InterTight leading-[30px] tracking-wide`,
        rest.className
      )}
    >
      {children}
    </Typography.H2>
  ) : (
    <Typography.Label className={twMerge('text-opacity-50', rest.className)}>{children}</Typography.Label>
  );
};
