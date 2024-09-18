import { Icon, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Skeletons from '../Skeletons';
import { useMostFollowedUsers } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';

export default function WhoFollow() {
  const { pubky } = usePubkyClientContext();
  const { data, isLoading, isError } = useMostFollowedUsers(pubky, 0, 3);
  const recommendedProfiles = data;

  if (isError) console.error(isError);

  {
    /**

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
  */
  }

  return (
    <div className="mb-6">
      <SideCard.Header title="Who to follow" />
      <SideCard.Content className="flex flex-col gap-2">
        {isLoading ? (
          <Skeletons.Simple />
        ) : recommendedProfiles && recommendedProfiles.length > 0 ? (
          recommendedProfiles
            .slice(0, 3)
            .map((recommendedProfile, index: number) => {
              const pubkeyUser =
                pubky && recommendedProfile?.details?.id.includes(pubky);
              const isFollowed =
                recommendedProfile?.relationship?.following || false;

              return (
                <div key={index}>
                  <SideCard.User
                    uri={recommendedProfile?.details?.id}
                    uriImage={
                      recommendedProfile?.details?.image ||
                      '/images/Userpic.png'
                    }
                    username={Utils.minifyText(
                      recommendedProfile?.details?.name,
                      8
                    )}
                    label={Utils.minifyPubky(recommendedProfile?.details?.id)}
                  >
                    {pubkeyUser ? (
                      <SideCard.FollowAction
                        text="Me"
                        icon={<Icon.Check />}
                        className="bg-transparent cursor-default"
                      />
                    ) : isLoading ? (
                      <SideCard.FollowAction
                        disabled
                        icon={<Icon.LoadingSpin size="16" />}
                        variant="small"
                      />
                    ) : isFollowed ? (
                      <SideCard.FollowAction
                        // onClick={
                        //  loadingFollowers[recommendedProfile.id]
                        //   ? undefined
                        //    : () => unfollowUser(recommendedProfile.id)
                        //}
                        //disabled={loadingFollowers[recommendedProfile.id]}
                        // loading={loadingFollowers[recommendedProfile.id]}
                        icon={<Icon.Minus size="16" />}
                        variant="small"
                      />
                    ) : (
                      <SideCard.FollowAction
                        //onClick={
                        //  loadingFollowers[recommendedProfile.id]
                        //    ? undefined
                        //    : () => followUser(recommendedProfile.id)
                        //}
                        //disabled={loadingFollowers[recommendedProfile.id]}
                        //loading={loadingFollowers[recommendedProfile.id]}
                        icon={<Icon.Plus size="16" />}
                        variant="small"
                      />
                    )}
                  </SideCard.User>
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
