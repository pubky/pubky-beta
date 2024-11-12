'use client';

import { Icon, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { useInfluencersUsers } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { useRouter } from 'next/navigation';

export default function Influencers() {
  const router = useRouter();
  const { pubky } = usePubkyClientContext();
  const {
    data: influencers,
    isLoading,
    isError,
  } = useInfluencersUsers(pubky ?? '', pubky, 0, 3);

  if (isError) console.error(isError);

  return (
    <div className="my-6">
      <SideCard.Header title="Influencers" />
      <SideCard.Content className="flex flex-col gap-2">
        {isLoading ? (
          <Skeletons.Simple />
        ) : influencers && influencers.length > 0 ? (
          <>
            {influencers.slice(0, 3).map((influencer, index: number) => {
              return (
                <div key={index}>
                  <SideCard.User
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
            <SideCard.Action
              icon={<Icon.UsersLeft size="16" />}
              text="See All"
              onClick={() => router.push('/influencers')}
            />
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
