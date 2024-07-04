'use client';

import { Content, Icon, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { IRecommendedProfiles } from '@/types';
import Skeletons from './Skeletons';

export default function WhoFollow() {
  const { pubky, getRecommendedProfiles, follow, unfollow, listFollowing } =
    useClientContext();
  const [recommendedProfiles, setRecommendedProfiles] = useState<
    IRecommendedProfiles[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});

  useEffect(() => {
    async function fetchFollowed() {
      try {
        if (!pubky) return;
        const result = await getRecommendedProfiles(pubky);

        if (result) {
          setRecommendedProfiles(result);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowed();
  }, [getRecommendedProfiles, pubky]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        if (!pubky || !recommendedProfiles) return;

        const following = await listFollowing(pubky);

        if (following) {
          const followingIds = following.following.map((user) =>
            user.uri.replace('pubky:', '')
          );
          const matchedFollowedIds = recommendedProfiles.filter((profile) =>
            followingIds.includes(profile.id)
          );

          if (matchedFollowedIds.length > 0) {
            setInitLoadingFollowers(false);
            matchedFollowedIds.forEach((followed) => {
              setFollowedUser((prevState) => ({
                ...prevState,
                [followed.id]: true,
              }));
            });
          } else {
            setInitLoadingFollowers(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowing();
  }, [pubky, recommendedProfiles, listFollowing]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
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

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-6">
      <SideCard.Header title="Who to follow" />
      <SideCard.Content>
        {loading ? (
          <Skeletons.Simple />
        ) : recommendedProfiles && recommendedProfiles.length > 0 ? (
          recommendedProfiles
            .slice(0, 3)
            .map((recommendedProfile, index: number) => {
              const pubkeyUser = pubky && recommendedProfile.id.includes(pubky);
              const isFollowed = followedUser[recommendedProfile.id] || false;

              return (
                <div key={index}>
                  <SideCard.User
                    uri={recommendedProfile.id}
                    src={
                      recommendedProfile?.profile?.image ||
                      '/images/Userpic.png'
                    }
                    username={Utils.minifyText(
                      recommendedProfile?.profile?.name,
                      8
                    )}
                    label={Utils.minifyPubky(recommendedProfile.id)}
                  >
                    {pubkeyUser ? (
                      <SideCard.FollowAction
                        text="Me"
                        icon={<Icon.Check />}
                        className="bg-transparent cursor-default"
                      />
                    ) : initLoadingFollowers ? (
                      <SideCard.FollowAction
                        disabled
                        icon={<Icon.LoadingSpin size="16" />}
                        variant="small"
                      />
                    ) : isFollowed ? (
                      <SideCard.FollowAction
                        onClick={
                          loadingFollowers[recommendedProfile.id]
                            ? undefined
                            : () => unfollowUser(recommendedProfile.id)
                        }
                        disabled={loadingFollowers[recommendedProfile.id]}
                        loading={loadingFollowers[recommendedProfile.id]}
                        icon={<Icon.Minus size="16" />}
                        variant="small"
                      />
                    ) : (
                      <SideCard.FollowAction
                        onClick={
                          loadingFollowers[recommendedProfile.id]
                            ? undefined
                            : () => followUser(recommendedProfile.id)
                        }
                        disabled={loadingFollowers[recommendedProfile.id]}
                        loading={loadingFollowers[recommendedProfile.id]}
                        icon={<Icon.Plus size="16" />}
                        variant="small"
                      />
                    )}
                  </SideCard.User>
                  {index !== recommendedProfiles.length - 1 && (
                    <Content.Divider className="my-2" />
                  )}
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
