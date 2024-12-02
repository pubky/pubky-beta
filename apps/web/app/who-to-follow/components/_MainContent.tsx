'use client';

import Skeletons from '@/components/Skeletons';
import { usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { RecommendedUsers } from '.';
import { useStreamUsers } from '@/hooks/useStream';
import { getUserStream } from '@/services/streamService';
import { Typography } from '@social/ui-shared';

export interface LoadingUsers {
  [pubky: string]: boolean;
}

export default function MainContent() {
  const { pubky } = usePubkyClientContext();
  const { data: recommendedProfiles, isLoading } = useStreamUsers(
    pubky ?? '',
    pubky ?? '',
    'recommended',
  );

  const [loadingUsers, setLoadingUsers] = useState<LoadingUsers>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  useEffect(() => {
    if (recommendedProfiles) {
      const initialFollowedState = recommendedProfiles.reduce(
        (acc, profile) => {
          acc[profile.details.id] = profile.relationship?.following || false;
          return acc;
        },
        {} as { [pubky: string]: boolean },
      );
      setFollowed(initialFollowedState);
    }
  }, [recommendedProfiles]);

  return (
    <div className="flex-col inline-flex gap-3 w-full">
      {isLoading ? (
        <div className="w-full">
          <Skeletons.Simple />
        </div>
      ) : recommendedProfiles && recommendedProfiles.length > 0 ? (
        <>
          {recommendedProfiles &&
            recommendedProfiles.map((user) => {
              const pubkeyUser = pubky && user?.details?.id.includes(pubky);
              const isFollowed = followed[user?.details?.id];

              return (
                <div key={`user-${user?.details?.id}`} className="w-full">
                  <div className="w-full">
                    <div className="p-6 rounded-2xl bg-white bg-opacity-10 lg:p-0 lg:bg-transparent flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                      <div className="w-full flex justify-between items-center">
                        <RecommendedUsers.User user={user} />
                        <RecommendedUsers.Counters mobile user={user} />
                      </div>
                      <RecommendedUsers.Tags user={user} />
                      <RecommendedUsers.Counters user={user} />
                      <RecommendedUsers.Buttons
                        user={user}
                        setLoadingUsers={setLoadingUsers}
                        loadingUsers={loadingUsers}
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
      ) : (
        <div className="mt-[100px] col-span-3 flex justify-center items-center gap-6">
          <Typography.H2 className="font-normal text-opacity-30">
            No users to follow
          </Typography.H2>
        </div>
      )}
    </div>
  );
}
