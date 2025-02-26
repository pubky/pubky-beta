import { Typography } from '@social/ui-shared';
import { twMerge } from 'tailwind-merge';

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Root({ children, ...rest }: RootProps) {
  return (
    <div {...rest} className={twMerge('w-full flex-col gap-6 inline-flex', rest.className)}>
      <div className="flex-col gap-2 flex">
        <Typography.H2>Notifications</Typography.H2>
        <div className="flex-col flex">{children}</div>
      </div>
    </div>
  );
}
