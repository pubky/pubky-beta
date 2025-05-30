'use client';

import { ImageByUri } from '@/components/ImageByUri';
import Skeletons from '@/components/Skeletons';
import { usePubkyClientContext } from '@/contexts';
import { useStreamUsers } from '@/hooks/useStream';
import { Button, Icon, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { useState } from 'react';

export interface LoadingMutedUsers {
  [pubky: string]: boolean;
}

export default function MutedUsers() {
  const { pubky, mute, unmute, setMutedUsers } = usePubkyClientContext();
  const { data: mutedUsers, isLoading, isError } = useStreamUsers(pubky ?? '', pubky ?? '', 'muted');
  if (isError) console.log(isError);

  const [loadingMutedUsers, setLoadingMutedUsers] = useState<LoadingMutedUsers>({});
  const [muted, setMuted] = useState<{ [pubky: string]: boolean }>({});
  const [isLoadingUnmuteAll, setIsLoadingUnmuteAll] = useState(false);

  const muteUser = async (pubkyMute: string) => {
    try {
      if (!pubkyMute) return;
      setLoadingMutedUsers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyMute]: true
      }));

      const result = await mute(pubkyMute);
      setMuted((prevState) => ({
        ...prevState,
        [pubkyMute]: result
      }));

      if (result) {
        setMutedUsers((prev) => (prev ? [...prev, pubkyMute] : [pubkyMute]));
      }

      setLoadingMutedUsers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyMute]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unmuteUser = async (pubkyUnmute: string) => {
    try {
      if (!pubkyUnmute) return;
      setLoadingMutedUsers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnmute]: true
      }));

      const result = await unmute(pubkyUnmute);
      setMuted((prevState) => ({
        ...prevState,
        [pubkyUnmute]: !result
      }));

      if (result) {
        setMutedUsers((prev) => prev?.filter((user) => user !== pubkyUnmute));
      }

      setLoadingMutedUsers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnmute]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unmuteAllUsers = async () => {
    try {
      if (mutedUsers) {
        setIsLoadingUnmuteAll(true);
        setLoadingMutedUsers(mutedUsers.reduce((acc, user) => ({ ...acc, [user.details.id]: true }), {}));

        await Promise.all(mutedUsers.map((user) => unmuteUser(user.details.id)));

        setMutedUsers([]);
        setLoadingMutedUsers({});
      }
    } catch (error) {
      console.log('Error while unmute all users:', error);
    } finally {
      setIsLoadingUnmuteAll(false);
    }
  };

  return (
    <div
      id="muted-users-root"
      className="p-8 md:p-12 bg-white bg-opacity-10 rounded-lg flex-col justify-start items-start gap-12 inline-flex"
    >
      <div className="w-full flex-col justify-start items-start gap-6 flex">
        <div className="justify-start items-center gap-2 inline-flex">
          <Icon.SpeakerSimpleSlash size="24" />
          <Typography.H2>Muted users</Typography.H2>
        </div>
        <Typography.Body variant="medium" className="text-opacity-80">
          Here is an overview of all users you muted. You can choose to unmute users if you want.
        </Typography.Body>
        <div className="w-full flex-col inline-flex gap-3 col-span-5 xl:col-span-4 2xl:col-span-3">
          {isLoading ? (
            <div className="w-full">
              <Skeletons.Simple />
            </div>
          ) : mutedUsers && mutedUsers.length > 0 ? (
            <>
              {mutedUsers.map((mutedUser) => {
                const pubkeyUser = pubky && mutedUser?.details?.id.includes(pubky);
                const isMuted = muted[mutedUser?.details?.id] ?? true;

                return (
                  <div key={mutedUser?.details?.id} className="w-full">
                    <div className="w-full">
                      <div className="flex-col md:flex-row justify-start gap-4 inline-flex w-full">
                        <Link className="flex gap-2 w-full" href={`/profile/${mutedUser?.details?.id}`}>
                          <ImageByUri
                            id={mutedUser?.details?.id}
                            isCensored={Utils.isProfileCensored(mutedUser)}
                            width={48}
                            height={48}
                            alt={`profile-pic-${mutedUser?.details?.id}`}
                            className="rounded-full w-[48px] h-[48px] max-w-none"
                          />
                          <div className="flex-col justify-center items-start inline-flex">
                            <Typography.Body variant="medium-bold">
                              {mutedUser?.details.name && Utils.minifyText(mutedUser?.details?.name, 20)}
                            </Typography.Body>
                            <Typography.Label className="text-opacity-30 -mt-1">
                              {mutedUser?.details?.id && Utils.minifyPubky(mutedUser?.details?.id)}
                            </Typography.Label>
                          </div>
                        </Link>

                        <div className="flex gap-4">
                          {pubkeyUser ? (
                            <Button.Medium
                              className="w-full md:w-[104px] bg-transparent cursor-default"
                              icon={<Icon.User size="16" />}
                            >
                              Me
                            </Button.Medium>
                          ) : isLoading ? (
                            <Button.Medium disabled loading={isLoading}>
                              Loading
                            </Button.Medium>
                          ) : isMuted ? (
                            <Button.Medium
                              id="unmute-btn"
                              onClick={
                                loadingMutedUsers[mutedUser?.details?.id]
                                  ? undefined
                                  : () => unmuteUser(mutedUser?.details?.id)
                              }
                              disabled={loadingMutedUsers[mutedUser?.details?.id]}
                              loading={loadingMutedUsers[mutedUser?.details?.id]}
                              icon={<Icon.SpeakerSimpleSlash size="16" />}
                              className="w-full md:w-[104px]"
                            >
                              Unmute
                            </Button.Medium>
                          ) : (
                            <Button.Medium
                              id="mute-btn"
                              onClick={
                                loadingMutedUsers[mutedUser?.details?.id]
                                  ? undefined
                                  : () => muteUser(mutedUser?.details?.id)
                              }
                              disabled={loadingMutedUsers[mutedUser?.details?.id]}
                              loading={loadingMutedUsers[mutedUser.details?.id]}
                              icon={<Icon.SpeakerHigh size="16" />}
                              className="w-full md:w-[104px]"
                            >
                              Mute
                            </Button.Medium>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {mutedUsers.length > 1 && (
                <>
                  <div className="w-full h-px bg-white bg-opacity-10 my-6" />
                  <Button.Medium
                    onClick={() => (isLoadingUnmuteAll ? undefined : unmuteAllUsers())}
                    disabled={isLoadingUnmuteAll}
                    loading={isLoadingUnmuteAll}
                    icon={<Icon.SpeakerSimpleSlash size="16" />}
                    className="w-[180px]"
                  >
                    Unmute all users
                  </Button.Medium>
                </>
              )}
            </>
          ) : (
            <Typography.H2 className="flex self-center mt-[20px] font-normal text-opacity-20 text-center">
              No muted users yet
            </Typography.H2>
          )}
        </div>
      </div>
    </div>
  );
}
