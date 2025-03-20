'use client';

import { Icon, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { useStreamUsers } from '@/hooks/useStream';
import Link from 'next/link';

export default function WhoFollow() {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const { data: recommendedProfiles, isLoading } = useStreamUsers(pubky ?? '', pubky ?? '', 'recommended', 0, 3);

  const [loading, setLoading] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});

  useEffect(() => {
    if (recommendedProfiles) {
      const initialFollowedState = recommendedProfiles.reduce(
        (acc, profile) => {
          acc[profile.details.id] = profile.relationship?.following || false;
          return acc;
        },
        {} as { [pubky: string]: boolean }
      );
      setFollowedUser(initialFollowedState);
    }
  }, [recommendedProfiles]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoading((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true
      }));

      const result = await follow(pubkyFollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result
      }));

      setLoading((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;

      setLoading((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true
      }));

      const result = await unfollow(pubkyUnfollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result
      }));

      setLoading((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  if (recommendedProfiles === undefined) return <></>;

  return (
    <div className="mb-8">
      <SideCard.Header title="Who to Follow" />
      <SideCard.Content className="flex flex-col gap-2">
        {isLoading ? (
          <Skeletons.Simple />
        ) : recommendedProfiles && recommendedProfiles.length > 0 ? (
          <>
            {recommendedProfiles.slice(0, 3).map((recommendedProfile, index: number) => {
              const pubkeyUser = pubky && recommendedProfile?.details?.id.includes(pubky);
              const isFollowed = followedUser[recommendedProfile.details.id];

              return (
                <div key={index}>
                  <SideCard.UserSmall
                    uri={recommendedProfile?.details?.id}
                    username={Utils.minifyText(recommendedProfile?.details?.name, 11)}
                    label={Utils.minifyPubky(recommendedProfile?.details?.id)}
                  >
                    {pubkeyUser ? (
                      <SideCard.FollowAction
                        text="Me"
                        icon={<Icon.User size="16" />}
                        className="bg-transparent cursor-default"
                        variant="small"
                      />
                    ) : isLoading ? (
                      <SideCard.FollowAction disabled icon={<Icon.LoadingSpin size="16" />} variant="small" />
                    ) : isFollowed ? (
                      <SideCard.FollowAction
                        onClick={
                          loading[recommendedProfile.details.id]
                            ? undefined
                            : () => unfollowUser(recommendedProfile.details.id)
                        }
                        disabled={loading[recommendedProfile.details.id]}
                        loading={loading[recommendedProfile.details.id]}
                        icon={<Icon.Minus size="16" />}
                        variant="small"
                      />
                    ) : (
                      <SideCard.FollowAction
                        onClick={
                          loading[recommendedProfile.details.id]
                            ? undefined
                            : () => followUser(recommendedProfile.details.id)
                        }
                        disabled={loading[recommendedProfile.details.id]}
                        loading={loading[recommendedProfile.details.id]}
                        icon={<Icon.Plus size="16" />}
                        variant="small"
                      />
                    )}
                  </SideCard.UserSmall>
                </div>
              );
            })}
            <Link href="/who-to-follow" className="mt-2">
              <SideCard.Action icon={<Icon.UsersLeft size="16" />} textCSS="text-[13px]" text="See All" />
            </Link>
          </>
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No users to follow
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
