import { twMerge } from 'tailwind-merge';
import { Typography } from '@social/ui-shared';

interface HandleProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string | JSX.Element;
  pubkey?: string;
}

export default function Handle({ username, pubkey, ...rest }: HandleProps) {
  return (
    <div {...rest} className={twMerge('mt-6', rest.className)}>
      <Typography.Display className="sm:leading-[120px]">
        {username}
      </Typography.Display>
      {pubkey && (
        <Typography.H2 className="text-left text-opacity-50">
          {pubkey}
        </Typography.H2>
      )}
    </div>
  );
}
