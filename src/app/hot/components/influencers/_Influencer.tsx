'use client';

import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';
import { Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { UserView } from '@/types/User';

interface InfluencerProps {
  influencer: UserView | undefined;
}

export function Influencer({ influencer }: InfluencerProps) {
  return (
    <Link className="flex gap-2 w-full" href={`/profile/${influencer?.details?.id}`}>
      <ImageByUri
        id={influencer?.details?.id}
        isCensored={Utils.isProfileCensored(influencer)}
        width={48}
        height={48}
        alt={`profile-pic-${influencer?.details?.id}`}
        className="rounded-full w-[48px] h-[48px] max-w-none"
      />
      <div className="flex-col justify-center items-start inline-flex">
        <Typography.Body variant="medium-bold">
          {influencer?.details.name && Utils.minifyText(influencer?.details?.name, 20)}
        </Typography.Body>
        <Typography.Label className="text-opacity-30 -mt-1">
          {influencer?.details?.id && Utils.minifyPubky(influencer?.details?.id)}
        </Typography.Label>
      </div>
    </Link>
  );
}
