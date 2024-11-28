import { Button, Icon } from '@social/ui-shared';
import { UserView } from '@/types/User';
import { usePubkyClientContext } from '@/contexts';
import { LoadingUsers } from './_MainContent';

interface ButtonsProps {
  user: UserView | undefined;
  setLoadingUsers: React.Dispatch<React.SetStateAction<LoadingUsers>>;
  setFollowed: React.Dispatch<
    React.SetStateAction<{ [pubky: string]: boolean }>
  >;
  pubkeyUser: string | boolean | undefined;
  isLoading: boolean;
  isFollowed: boolean;
  loadingUsers: LoadingUsers;
}

export function Buttons({
  user,
  setLoadingUsers,
  setFollowed,
  pubkeyUser,
  isLoading,
  isFollowed,
  loadingUsers,
}: ButtonsProps) {
  const { follow, unfollow } = usePubkyClientContext();

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingUsers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
      setLoadingUsers((prevLoadingUsers) => ({
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
      setLoadingUsers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
      setLoadingUsers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex gap-4">
      {user && (
        <>
          {pubkeyUser ? (
            <Button.Medium
              className="w-full lg:w-[104px] bg-transparent cursor-default"
              icon={<Icon.User size="16" />}
            >
              Me
            </Button.Medium>
          ) : isLoading ? (
            <Button.Medium disabled loading={isLoading}>
              Loading
            </Button.Medium>
          ) : isFollowed ? (
            <Button.Medium
              onClick={
                loadingUsers[user?.details?.id]
                  ? undefined
                  : () => unfollowUser(user?.details?.id)
              }
              disabled={loadingUsers[user?.details?.id]}
              loading={loadingUsers[user?.details?.id]}
              icon={<Icon.UserMinus size="16" />}
              className="w-full lg:w-[104px]"
            >
              Unfollow
            </Button.Medium>
          ) : (
            <Button.Medium
              onClick={
                loadingUsers[user?.details?.id]
                  ? undefined
                  : () => followUser(user?.details?.id)
              }
              disabled={loadingUsers[user?.details?.id]}
              loading={loadingUsers[user?.details?.id]}
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