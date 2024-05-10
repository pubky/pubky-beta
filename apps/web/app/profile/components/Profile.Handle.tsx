import { twMerge } from 'tailwind-merge';
import { Typography } from '@social/ui-shared';

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  pubkey?: string;
}

export default function Handle({ username, pubkey, ...rest }: HandleProps) {
  return (
    <div {...rest} className={twMerge('mt-6', rest.className)}>
      <Typography.Display>{username}</Typography.Display>
      {pubkey && (
        <Typography.H2 className="text-left text-opacity-50 -mt-4">
          {pubkey}
        </Typography.H2>
      )}
    </div>
  );
}
