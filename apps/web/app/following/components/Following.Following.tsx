'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import { minifyPubky } from '../../../libs/pubkyHelper';
import Link from 'next/link';
import { useClientContext } from '../../../contexts/client';
import { IFollowing, ICount, ContactInfoProps } from '../../../types';

interface FollowingProps extends React.HTMLAttributes<HTMLDivElement> {
  following?: IFollowing[];
}

export default function FollowingUsers({ following }: FollowingProps) {
  const { pubky, follow, unfollow, listFollowing, countContacts } =
    useClientContext();
  const [initLoadingFollowing, setInitLoadingFollowing] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState<{
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
        const followingUsers = await listFollowing(pubky);

        if (followingUsers && following) {
          const count = await fetchCount();
          setContactsCount(count);
          followingUsers.following.forEach((user) => {
            const uri = user.uri.replace('pubky:', '');
            if (
              following.some(
                (following) => following.uri.replace('pubky:', '') === uri
              )
            ) {
              setFollowed((prevState) => ({
                ...prevState,
                [uri]: true,
              }));
            }
          });
        }
        setInitLoadingFollowing(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pubky, following, listFollowing]);

  const fetchCount = async () => {
    const counts: ICount = {};
    if (!following || following.length === 0) return counts;

    for (const followingUser of following) {
      const followingId = followingUser.uri.replace('pubky:', '');
      counts[followingId] = await countContacts(followingId);
    }
    return counts;
  };

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;
      setLoadingFollowing((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
      setLoadingFollowing((prevLoadingUsers) => ({
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
      setLoadingFollowing((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
      setLoadingFollowing((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const FollowingInfo = ({ label, value, loading }: ContactInfoProps) => (
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
      {following && following.length > 0 ? (
        following.map((followingUser, index) => {
          const pubkeyUser = pubky && followingUser.uri.includes(pubky);
          const followingId = followingUser.uri.replace('pubky:', '');
          const isFollowed = followed[followingId] || false;
          const count = contactsCount && contactsCount[followingId];

          return (
            <div key={index} className="w-full">
              <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                <Link
                  className="flex gap-4 lg:w-[450px] xl:w-[350px]"
                  href={`/profile/${followingId}`}
                >
                  <Image
                    width={48}
                    height={48}
                    src={followingUser?.profile?.image || '/images/Userpic.png'}
                    alt={`following-pic-${index + 1}`}
                    className="rounded-full w-[48px] h-[48px]"
                  />
                  <div className="flex-col justify-center items-start gap-1 inline-flex">
                    <Typography.Label className="text-opacity-30 -mb-1">
                      {minifyPubky(followingId)}
                    </Typography.Label>
                    <Typography.Body variant="medium-bold">
                      {followingUser.profile.name}
                    </Typography.Body>
                  </div>
                </Link>
                <div className="lg:flex justify-start items-center lg:w-full">
                  <Typography.Body
                    variant="small"
                    className="lg:px-12 text-opacity-80 leading-[18px]"
                  >
                    {followingUser.profile.bio}
                  </Typography.Body>
                </div>
                <FollowingInfo
                  label="Followers"
                  value={count?.followers}
                  loading={initLoadingFollowing}
                />
                <FollowingInfo
                  label="Following"
                  value={count?.following}
                  loading={initLoadingFollowing}
                />
                <div className="flex gap-4">
                  {pubkeyUser ? (
                    <Button.Medium
                      className="w-[154px] bg-transparent cursor-default"
                      icon={<Icon.Check />}
                    >
                      Me
                    </Button.Medium>
                  ) : initLoadingFollowing ? (
                    <Button.Medium disabled loading={initLoadingFollowing}>
                      Loading
                    </Button.Medium>
                  ) : isFollowed ? (
                    <Button.Medium
                      onClick={
                        loadingFollowing[followingId]
                          ? undefined
                          : () => unfollowUser(followingId)
                      }
                      disabled={loadingFollowing[followingId]}
                      loading={loadingFollowing[followingId]}
                      icon={<Icon.UserMinus size="16" />}
                      className="w-[154px]"
                    >
                      Unfollow
                    </Button.Medium>
                  ) : (
                    <Button.Medium
                      onClick={
                        loadingFollowing[followingId]
                          ? undefined
                          : () => followUser(followingId)
                      }
                      disabled={loadingFollowing[followingId]}
                      loading={loadingFollowing[followingId]}
                      icon={<Icon.UserPlus size="16" />}
                      className="w-[154px]"
                    >
                      Follow
                    </Button.Medium>
                  )}
                </div>
              </div>
              {index !== following.length - 1 && <Content.Divider />}
            </div>
          );
        })
      ) : (
        <Typography.H2 className="font-normal text-opacity-30">
          No following yet.
        </Typography.H2>
      )}
    </>
  );
}
