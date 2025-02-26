'use client';

import { Button, Icon } from '@social/ui-shared';
import { UserView } from '@/types/User';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { LoadingInfluencers } from './_MainContent';

interface ButtonsProps {
  influencer: UserView | undefined;
  setLoadingInfluencers: React.Dispatch<React.SetStateAction<LoadingInfluencers>>;
  setFollowed: React.Dispatch<React.SetStateAction<{ [pubky: string]: boolean }>>;
  pubkeyUser: string | boolean | undefined;
  isLoading: boolean;
  isFollowed: boolean;
  loadingInfluencers: LoadingInfluencers;
}

export function Buttons({
  influencer,
  setLoadingInfluencers,
  setFollowed,
  pubkeyUser,
  isLoading,
  isFollowed,
  loadingInfluencers
}: ButtonsProps) {
  const { follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingInfluencers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true
      }));

      const result = await follow(pubkyFollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result
      }));
      setLoadingInfluencers((prevLoadingUsers) => ({
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
      setLoadingInfluencers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true
      }));

      const result = await unfollow(pubkyUnfollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result
      }));
      setLoadingInfluencers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex gap-4">
      {influencer && (
        <>
          {pubkeyUser ? (
            <Button.Medium className="w-full lg:w-[104px] bg-transparent cursor-default" icon={<Icon.User size="16" />}>
              Me
            </Button.Medium>
          ) : isLoading ? (
            <Button.Medium disabled loading={isLoading}>
              Loading
            </Button.Medium>
          ) : isFollowed ? (
            <Button.Medium
              onClick={
                loadingInfluencers[influencer?.details?.id] ? undefined : () => unfollowUser(influencer?.details?.id)
              }
              disabled={loadingInfluencers[influencer?.details?.id]}
              loading={loadingInfluencers[influencer?.details?.id]}
              icon={<Icon.UserMinus size="16" />}
              className="w-full lg:w-[104px]"
            >
              Unfollow
            </Button.Medium>
          ) : (
            <Button.Medium
              onClick={
                loadingInfluencers[influencer?.details?.id] ? undefined : () => followUser(influencer?.details?.id)
              }
              disabled={loadingInfluencers[influencer?.details?.id]}
              loading={loadingInfluencers[influencer?.details?.id]}
              icon={<Icon.UserPlus size="16" />}
              className="w-full lg:w-[104px]"
            >
              Follow
            </Button.Medium>
          )}
        </>
      )}
    </div>
  );
}
