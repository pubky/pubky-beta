import { Icon, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Time = ({ children, ...rest }: RootProps) => {
  return (
    <div className="grow justify-end items-center gap-1 flex mt-2">
      <Icon.Clock size="16" color="gray" />
      <Typography.Caption
        {...rest}
        variant="bold"
        className={twMerge(`text-white text-opacity-30`, rest.className)}
      >
        {children}
      </Typography.Caption>
    </div>
  );
};
