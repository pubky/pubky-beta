'use client';

import { Content, Icon, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';
import { minifyText } from '../../libs/textHelper';
import { IRecommendedProfiles } from '../../types';

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
    <div>
      <SideCard.Header title="Who to follow" />
      <SideCard.Content>
        {loading ? (
          <>
            <div className="flex w-full justify-center">
              <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
            </div>
            <Typography.Body
              variant="medium-bold"
              className="col-span-3 mt-2 flex justify-center items-center gap-6 text-opacity-20"
            >
              Loading Who to follow
            </Typography.Body>
          </>
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
                    username={minifyText(recommendedProfile?.profile?.name)}
                    label={minifyPubky(recommendedProfile.id)}
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
                        text="Loading"
                        icon={<Icon.LoadingSpin size="16" />}
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
                        text="Unfollow"
                        icon={<Icon.UserMinus size="16" />}
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
                        text="Follow"
                        icon={<Icon.UserPlus size="16" />}
                      />
                    )}
                  </SideCard.User>
                  {index !== recommendedProfiles.length - 1 && (
                    <Content.Divider />
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
