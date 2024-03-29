import { twMerge } from 'tailwind-merge';
import { Typography } from '../Typography';
import { Icon } from '../Icon';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  size?: 'full' | 'normal';
}

export const Time = ({ children, size = 'normal', ...rest }: RootProps) => {
  const baseCSS =
    size === 'full'
      ? 'grow justify-end xl:justify-end items-center gap-1 xl:ml-24 flex mt-2 lg:mt-4'
      : 'grow justify-end items-center gap-1 flex mt-2';
  return (
    <div className={twMerge(baseCSS, rest.className)}>
      {children ? (
        <>
          <Icon.Clock size="16" color="gray" />
          <Typography.Caption
            {...rest}
            variant="bold"
            className="text-white text-opacity-30"
          >
            {children}
          </Typography.Caption>
        </>
      ) : (
        <div className="h-2.5 bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full w-24"></div>
      )}
    </div>
  );
};
