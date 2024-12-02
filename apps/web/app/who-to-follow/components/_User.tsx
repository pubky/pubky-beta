import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';

interface UserProps {
  user: UserView | undefined;
}

export function User({ user }: UserProps) {
  return (
    <Link className="flex gap-2 w-full" href={`/profile/${user?.details?.id}`}>
      <ImageByUri
        width={48}
        height={48}
        uri={user?.details?.image || '/images/webp/Userpic.webp'}
        alt={`profile-pic-${user?.details?.id}`}
        className="rounded-full w-[48px] h-[48px] max-w-none"
      />
      <div className="flex-col justify-center items-start inline-flex">
        <Typography.Body variant="medium-bold">
          {user?.details.name && Utils.minifyText(user?.details?.name, 20)}
        </Typography.Body>
        <Typography.Label className="text-opacity-30 -mt-1">
          {user?.details?.id && Utils.minifyPubky(user?.details?.id)}
        </Typography.Label>
      </div>
    </Link>
  );
}
