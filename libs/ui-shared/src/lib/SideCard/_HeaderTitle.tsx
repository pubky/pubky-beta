import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'light' | 'label';
  children: string;
}
export const HeaderTitle = ({
  variant = 'light',
  children,
  ...rest
}: HeaderTitleProps) => {
  return variant === 'light' ? (
    <Typography.H2
      {...rest}
      variant="light"
      className={twMerge('text-opacity-50 font-light', rest.className)}
    >
      {children}
    </Typography.H2>
  ) : (
    <Typography.Label className={twMerge('text-opacity-50', rest.className)}>
      {children}
    </Typography.Label>
  );
};
