import { Card, Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export default function Root({ children, ...rest }: RootProps) {
  return (
    <div className="flex-col gap-6 inline-flex">
      <Typography.H2>517 followers</Typography.H2>
      <Card.Primary className="z-auto">
        <div
          {...rest}
          className={twMerge(
            `flex-col justify-start items-start flex`,
            rest.className
          )}
        >
          {children}
        </div>
      </Card.Primary>
    </div>
  );
}
