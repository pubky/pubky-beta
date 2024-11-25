'use client';

import Skeletons from '@/components/Skeletons';
import { usePubkyClientContext } from '@/contexts';
import { useMostFollowedUsers } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { RecommendedUsers } from '.';

export interface LoadingUsers {
  [pubky: string]: boolean;
}

export default function MainContent() {
  const { pubky } = usePubkyClientContext();
  const {
    data: users,
    isLoading,
    isError,
  } = useMostFollowedUsers(pubky ?? '', pubky);
  console.log('users', users);
  if (isError) console.error(isError);

  const [loadingUsers, setLoadingUsers] = useState<LoadingUsers>({});
  const [followed, setFollowed] = useState<{ [pubky: string]: boolean }>({});

  useEffect(() => {
    if (users) {
      const initialFollowedState = users.reduce((acc, profile) => {
        acc[profile.details.id] = profile.relationship?.following || false;
        return acc;
      }, {} as { [pubky: string]: boolean });
      setFollowed(initialFollowedState);
    }
  }, [users]);

  return (
    <div className="flex-col inline-flex gap-3 w-full">
      {isLoading ? (
        <div className="w-full">
          <Skeletons.Simple />
        </div>
      ) : (
        <>
          {users &&
            users.map((user) => {
              const pubkeyUser = pubky && user?.details?.id.includes(pubky);
              const isFollowed = followed[user?.details?.id];

              return (
                <div key={user?.details?.id} className="w-full">
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
      )}
    </div>
  );
}
