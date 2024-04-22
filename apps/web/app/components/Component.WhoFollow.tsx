'use client';

import { Content, Icon, SideCard, Typography } from '@social/ui-shared';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../contexts/client';
import { minifyPubky } from '../../libs/pubkyHelper';
import { minifyText } from '../../libs/textHelper';
import { IMostFollowed } from '../../types';

export default function WhoFollow() {
  const { pubky, getMostFollowed, follow, unfollow, listFollowing } =
    useClientContext();
  const [hotFollowed, setHotFollowed] = useState<IMostFollowed[] | null>(null);
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
        const result = await getMostFollowed();

        if (result) {
          setHotFollowed(result);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowed();
  }, [getMostFollowed]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        if (!pubky) return;

        const following = await listFollowing(pubky);

        if (following) {
          following.following.forEach((user) => {
            const id = user.uri.replace('pubky:', '');
            if (
              Array.isArray(hotFollowed) &&
              hotFollowed.some((followed) => followed.id === id)
            ) {
              setFollowedUser((prevState) => ({
                ...prevState,
                [id]: true,
              }));
              setInitLoadingFollowers(false);
            }
          });
          if (following.following.length === 0) {
            setInitLoadingFollowers(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky, hotFollowed]);

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
        ) : hotFollowed && hotFollowed.length > 0 ? (
          hotFollowed.slice(0, 3).map((followed, index: number) => {
            const pubkeyUser = pubky && followed.id.includes(pubky);
            const isFollowed = followedUser[followed.id] || false;

            return (
              <div key={index}>
                <SideCard.User
                  uri={followed.id}
                  src={followed?.profile?.image || '/images/Userpic.png'}
                  username={minifyText(followed?.profile?.name)}
                  label={minifyPubky(followed.id)}
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
                        loadingFollowers[followed.id]
                          ? undefined
                          : () => unfollowUser(followed.id)
                      }
                      disabled={loadingFollowers[followed.id]}
                      loading={loadingFollowers[followed.id]}
                      text="Unfollow"
                      icon={<Icon.UserMinus size="16" />}
                    />
                  ) : (
                    <SideCard.FollowAction
                      onClick={
                        loadingFollowers[followed.id]
                          ? undefined
                          : () => followUser(followed.id)
                      }
                      disabled={loadingFollowers[followed.id]}
                      loading={loadingFollowers[followed.id]}
                      text="Follow"
                      icon={<Icon.UserPlus size="16" />}
                    />
                  )}
                </SideCard.User>
                {index !== hotFollowed.length - 1 && <Content.Divider />}
              </div>
            );
          })
        ) : (
          <Typography.Body className="text-opacity-50" variant="small">
            No users yet
          </Typography.Body>
        )}
      </SideCard.Content>
    </div>
  );
}
