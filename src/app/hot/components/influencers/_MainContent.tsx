'use client';

import Skeletons from '@/components/Skeletons';
import { usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { Influencers } from '.';
import { useStreamUsers } from '@/hooks/useStream';

export interface LoadingInfluencers {
  [pubky: string]: boolean;
}

export default function MainContent() {
  const { pubky } = usePubkyClientContext();
  const { data: influencers, isLoading, isError } = useStreamUsers(pubky ?? '', pubky ?? '', 'influencers');
  if (isError) console.warn(isError);

  const [loadingInfluencers, setLoadingInfluencers] = useState<LoadingInfluencers>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  useEffect(() => {
    if (influencers) {
      const initialFollowedState = influencers.reduce(
        (acc, profile) => {
          acc[profile.details.id] = profile.relationship?.following || false;
          return acc;
        },
        {} as { [pubky: string]: boolean }
      );
      setFollowed(initialFollowedState);
    }
  }, [influencers]);

  return (
    <div className="flex-col inline-flex gap-3 w-full">
      {isLoading ? (
        <div className="w-full">
          <Skeletons.Simple />
        </div>
      ) : (
        <>
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
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
}
