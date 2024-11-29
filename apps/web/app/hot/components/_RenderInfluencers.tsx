'use client';

import Skeletons from '@/components/Skeletons';
import { Typography } from '@social/ui-shared';
import { UserView } from '@/types/User';
import { useEffect, useState } from 'react';
import { LoadingInfluencers } from '@/app/hot/components/influencers/_MainContent';
import { usePubkyClientContext } from '@/contexts';
import { Influencers } from '@/app/hot/components/influencers';

interface RenderInfluencersProps {
  influencers: UserView[] | undefined;
  initloadingInfluencers: boolean;
}

const RenderInfluencers = ({
  influencers,
  initloadingInfluencers,
}: RenderInfluencersProps) => {
  const { pubky } = usePubkyClientContext();
  const [loadingInfluencers, setLoadingInfluencers] =
    useState<LoadingInfluencers>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  useEffect(() => {
    if (influencers) {
      const initialFollowedState = influencers.reduce(
        (acc, profile) => {
          acc[profile.details.id] = profile.relationship?.following || false;
          return acc;
        },
        {} as { [pubky: string]: boolean },
      );
      setFollowed(initialFollowedState);
    }
  }, [influencers]);

  if (initloadingInfluencers) {
    return <Skeletons.Simple />;
  }

  return (
    <div className="flex flex-col gap-3" id="influencers">
      <Typography.H2 className="text-opacity-50 font-light">
        Influencers
      </Typography.H2>
      {influencers &&
        influencers.map((influencer) => {
          const pubkeyUser = pubky && influencer?.details?.id.includes(pubky);
          const isFollowed = followed[influencer?.details?.id];

          return (
            <div key={influencer?.details?.id} className="w-full">
              <div className="w-full">
                <div className="p-6 rounded-2xl bg-white bg-opacity-10 lg:p-0 lg:bg-transparent flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                  <div className="w-full flex justify-between items-center">
                    <Influencers.Influencer influencer={influencer} />
                    <Influencers.Counters mobile influencer={influencer} />
                  </div>
                  <Influencers.Tags influencer={influencer} />
                  <Influencers.Counters influencer={influencer} />
                  <Influencers.Buttons
                    influencer={influencer}
                    setLoadingInfluencers={setLoadingInfluencers}
                    loadingInfluencers={loadingInfluencers}
                    setFollowed={setFollowed}
                    pubkeyUser={pubkeyUser}
                    isFollowed={isFollowed}
                    isLoading={initloadingInfluencers}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default RenderInfluencers;
