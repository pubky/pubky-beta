'use client';

import { Icon, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { usePubkyClientContext } from '@/contexts';
import Link from 'next/link';
import { useStreamUsers } from '@/hooks/useStream';
import { twMerge } from 'tailwind-merge';

interface InfluencersProps {
  style?: string;
}

export default function Influencers({ style }: InfluencersProps) {
  const { pubky } = usePubkyClientContext();
  const { data: influencers, isLoading, isError } = useStreamUsers(pubky ?? '', pubky ?? '', 'influencers', 0, 3);

  if (isError) console.warn(isError);

  return (
    <div className={twMerge('mb-8', style)}>
      <SideCard.Header title="Active Users" />
      <SideCard.Content className="flex flex-col gap-2">
        {isLoading ? (
          <Skeletons.Simple />
        ) : influencers && influencers.length > 0 ? (
          <>
            {influencers.slice(0, 3).map((influencer, index: number) => {
              return (
                <div key={index}>
                  <SideCard.UserSmall
                    uri={influencer.details.id.replace('pubky:', '')}
                    username={influencer?.details?.name && Utils.minifyText(influencer?.details?.name, 15)}
                    postsCount={influencer?.counts?.posts}
                    tagsCount={influencer?.counts?.tags}
                  />
                </div>
              );
            })}
            {pubky && (
              <Link href="/hot#active" className="mt-2">
                <SideCard.Action icon={<Icon.UsersLeft size="16" />} textCSS="text-[13px]" text="See All" />
              </Link>
            )}
          </>
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No active users to show.
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
