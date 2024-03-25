import { twMerge } from 'tailwind-merge';
import { Typography } from '@social/ui-shared';

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
}

export default function Handle({ username, ...rest }: HandleProps) {
  return (
    <Typography.Display {...rest} className={twMerge('mt-6', rest.className)}>
      {username}
    </Typography.Display>
  );
}
