import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';

interface HeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'normal' | 'label';
  children: string;
}
export const HeaderTitle = ({
  variant = 'normal',
  children,
  ...rest
}: HeaderTitleProps) => {
  return (
    <>
      {variant === 'normal' ? (
        <Typography.Body
          {...rest}
          className={twMerge(rest.className)}
          variant="large-bold"
        >
          {children}
        </Typography.Body>
      ) : (
        <Typography.Label
          {...rest}
          className={twMerge('text-opacity-50', rest.className)}
        >
          {children}
        </Typography.Label>
      )}
    </>
  );
};
