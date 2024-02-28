import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Time = ({ children, ...rest }: RootProps) => {
  return (
    <div
      className={twMerge(
        'grow justify-end items-center gap-1 flex mt-2',
        rest.className
      )}
    >
      <Icon.Clock size="16" color="gray" />
      <Typography.Caption
        {...rest}
        variant="bold"
        className="text-white text-opacity-30"
      >
        {children}
      </Typography.Caption>
    </div>
  );
};
