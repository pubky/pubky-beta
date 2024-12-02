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
  const {
    data: influencers,
    isLoading,
    isError,
  } = useStreamUsers(pubky ?? '', pubky ?? '', 'pioneers', 0, 3);

  if (isError) console.error(isError);

  return (
    <div className={twMerge('my-6', style)}>
      <SideCard.Header title="Influencers" />
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
                    uriImage={
                      influencer?.details?.image || '/images/webp/Userpic.webp'
                    }
                    username={
                      influencer?.details?.name &&
                      Utils.minifyText(influencer?.details?.name, 15)
                    }
                    // label={Utils.minifyPubky(friend.uri.replace('pubky:', ''))}
                    postsCount={influencer?.counts?.posts}
                    tagsCount={influencer?.counts?.tags}
                  />
                </div>
              );
            })}
            <Link href="/hot#influencers" className="mt-2">
              <SideCard.Action
                icon={<Icon.UsersLeft size="16" />}
                textCSS="text-[13px]"
                text="See All"
              />
            </Link>
          </>
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No influencers to show
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
