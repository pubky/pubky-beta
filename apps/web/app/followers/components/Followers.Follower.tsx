'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import { minifyPubky } from '../../../libs/pubkyHelper';
import Link from 'next/link';
import { useClientContext } from '../../../contexts/client';
import { IFollower, ICount, ContactInfoProps } from '../../../types';

interface FollowersProps extends React.HTMLAttributes<HTMLDivElement> {
  followers?: IFollower[];
}

export default function Follower({ followers }: FollowersProps) {
  const { pubky, follow, unfollow, listFollowing, countContacts } =
    useClientContext();
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followed, setFollowed] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [contactsCount, setContactsCount] = useState<ICount | undefined>();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!pubky) return;
        const following = await listFollowing(pubky);
        if (following && followers) {
          const count = await fetchCount();
          setContactsCount(count);
          following.following.forEach((user) => {
            const uri = user.uri.replace('pubky:', '');
            if (
              followers.some(
                (follower) => follower.uri.replace('pubky:', '') === uri
              )
            ) {
              setFollowed((prevState) => ({
                ...prevState,
                [uri]: true,
              }));
            }
          });
        }
        setInitLoadingFollowers(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky, listFollowing, followers]);

  const fetchCount = async () => {
    const counts: ICount = {};
    if (!followers || followers.length === 0) return counts;

    for (const follower of followers) {
      const followerId = follower.uri.replace('pubky:', '');
      counts[followerId] = await countContacts(followerId);
    }
    return counts;
  };

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
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
      setFollowed((prevState) => ({
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

  const FollowerInfo = ({ label, value, loading }: ContactInfoProps) => (
    <div className="flex-col justify-start items-start gap-1 inline-flex">
      <Typography.Label className="text-[12px] text-opacity-30 -mb-1">
        {label}
      </Typography.Label>
      {loading ? (
        <Icon.LoadingSpin size="20" />
      ) : (
        <Typography.Body variant="medium-bold">{value}</Typography.Body>
      )}
    </div>
  );

  return (
    <>
      {followers && followers.length > 0 ? (
        followers.map((follower, index) => {
          const pubkeyUser = pubky && follower.uri.includes(pubky);
          const followerId = follower.uri.replace('pubky:', '');
          const isFollowed = followed[followerId] || false;
          const count = contactsCount && contactsCount[followerId];

          return (
            <div key={index} className="w-full">
              <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                <Link
                  className="flex gap-4 lg:w-[450px] xl:w-[350px]"
                  href={`/profile/${followerId}`}
                >
                  <Image
                    width={48}
                    height={48}
                    src={follower?.profile?.image || '/images/Userpic.png'}
                    alt={`follower-pic-${index + 1}`}
                    className="rounded-full w-[48px] h-[48px]"
                  />
                  <div className="flex-col justify-center items-start gap-1 inline-flex">
                    <Typography.Label className="text-opacity-30 -mb-1">
                      {minifyPubky(followerId)}
                    </Typography.Label>
                    <Typography.Body variant="medium-bold">
                      {follower.profile.name}
                    </Typography.Body>
                  </div>
                </Link>
                <div className="lg:flex justify-start items-center lg:w-full">
                  <Typography.Body
                    variant="small"
                    className="lg:px-12 text-opacity-80 leading-[18px]"
                  >
                    {follower.profile.bio}
                  </Typography.Body>
                </div>
                <FollowerInfo
                  label="Followers"
                  value={count?.followers}
                  loading={initLoadingFollowers}
                />
                <FollowerInfo
                  label="Following"
                  value={count?.following}
                  loading={initLoadingFollowers}
                />
                <div className="flex gap-4">
                  {pubkeyUser ? (
                    <Button.Medium
                      className="w-[154px] bg-transparent cursor-default"
                      icon={<Icon.Check />}
                    >
                      Me
                    </Button.Medium>
                  ) : initLoadingFollowers ? (
                    <Button.Medium disabled loading={initLoadingFollowers}>
                      Loading
                    </Button.Medium>
                  ) : isFollowed ? (
                    <Button.Medium
                      onClick={
                        loadingFollowers[followerId]
                          ? undefined
                          : () => unfollowUser(followerId)
                      }
                      disabled={loadingFollowers[followerId]}
                      loading={loadingFollowers[followerId]}
                      icon={<Icon.UserMinus size="16" />}
                      className="w-[154px]"
                    >
                      Unfollow
                    </Button.Medium>
                  ) : (
                    <Button.Medium
                      onClick={
                        loadingFollowers[followerId]
                          ? undefined
                          : () => followUser(followerId)
                      }
                      disabled={loadingFollowers[followerId]}
                      loading={loadingFollowers[followerId]}
                      icon={<Icon.UserPlus size="16" />}
                      className="w-[154px]"
                    >
                      Follow
                    </Button.Medium>
                  )}
                </div>
              </div>
              {index !== followers.length - 1 && <Content.Divider />}
            </div>
          );
        })
      ) : (
        <Typography.H2 className="font-normal text-opacity-30">
          No followers yet.
        </Typography.H2>
      )}
    </>
  );
}
