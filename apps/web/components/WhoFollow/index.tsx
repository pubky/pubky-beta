'use client';

import { Icon, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { usePubkyClientContext } from '@/contexts';
import { useEffect, useState } from 'react';
import { useStreamUsers } from '@/hooks/useStream';

export default function WhoFollow() {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const {
    data: recommendedProfiles,
    isLoading,
    isError,
  } = useStreamUsers(pubky ?? '', pubky ?? '', 'most_followed', 0, 3);

  const [loading, setLoading] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});

  if (isError) console.error(isError);

  useEffect(() => {
    if (recommendedProfiles) {
      const initialFollowedState = recommendedProfiles.reduce(
        (acc, profile) => {
          acc[profile.details.id] = profile.relationship?.following || false;
          return acc;
        },
        {} as { [pubky: string]: boolean },
      );
      setFollowedUser(initialFollowedState);
    }
  }, [recommendedProfiles]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoading((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));

      setLoading((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false,
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
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));

      setLoading((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Who to Follow" />
      <SideCard.Content className="flex flex-col gap-2">
        {isLoading ? (
          <Skeletons.Simple />
        ) : recommendedProfiles && recommendedProfiles.length > 0 ? (
          recommendedProfiles
            .slice(0, 3)
            .map((recommendedProfile, index: number) => {
              const pubkeyUser =
                pubky && recommendedProfile?.details?.id.includes(pubky);
              const isFollowed = followedUser[recommendedProfile.details.id];

              return (
                <div key={index}>
                  <SideCard.UserSmall
                    uri={recommendedProfile?.details?.id}
                    uriImage={
                      recommendedProfile?.details?.image ||
                      '/images/webp/Userpic.webp'
                    }
                    username={Utils.minifyText(
                      recommendedProfile?.details?.name,
                      11,
                    )}
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
                      <SideCard.FollowAction
                        disabled
                        icon={<Icon.LoadingSpin size="16" />}
                        variant="small"
                      />
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
            })
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No users to follow
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
