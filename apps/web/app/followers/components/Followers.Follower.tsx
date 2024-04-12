/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button, Content, Icon, Typography } from '@social/ui-shared';
import { minifyPubky } from '../../../libs/pubkyHelper';
import Link from 'next/link';
import { useClientContext } from '../../../contexts/client';
import { IFollower } from '../../../types';

interface FollowersProps extends React.HTMLAttributes<HTMLDivElement> {
  followers?: IFollower[];
}

export default function Follower({ followers }: FollowersProps) {
  const [followed, setFollowed] = useState<{
    [pubky: string]: boolean;
  }>({});
  const { pubky, follow, unfollow, listFollowing } = useClientContext();

  useEffect(() => {
    console.log(followers);
    async function fetchData() {
      try {
        if (!pubky) return;
        const following = await listFollowing(pubky);
        if (following && followers) {
          following.following.forEach((user: any) => {
            const uri = user.uri.replace('pubky:', '');
            if (
              followers.some(
                (follower: any) => follower.uri.replace('pubky:', '') === uri
              )
            ) {
              setFollowed((prevState) => ({
                ...prevState,
                [uri]: true,
              }));
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, listFollowing, followers]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      const result = await follow(pubkyFollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;

      const result = await unfollow(pubkyUnfollow);
      setFollowed((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {followers && followers.length > 0 ? (
        followers.map((follower, index) => {
          const pubkeyUser = pubky && follower.uri.includes(pubky);
          const isFollowed =
            followed[follower.uri.replace('pubky:', '')] || false;

          return (
            <div key={index} className="w-full">
              <div className="flex-col lg:flex-row justify-start gap-4 inline-flex w-full">
                <Link
                  className="flex gap-4 lg:w-[450px] xl:w-[350px]"
                  href={`/profile/${follower.uri.replace('pubky:', '')}`}
                >
                  <Image
                    width={48}
                    height={48}
                    src={follower.profile.image}
                    alt={`follower-pic-${index + 1}`}
                    className="rounded-full w-[48px] h-[48px]"
                  />
                  <div className="flex-col justify-center items-start gap-1 inline-flex">
                    <Typography.Label className="text-opacity-30 -mb-1">
                      {minifyPubky(follower.uri.replace('pubky:', ''))}
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
                <div className="flex gap-4">
                  {pubkeyUser ? (
                    <Button.Medium
                      className="w-[154px] bg-transparent cursor-default"
                      icon={<Icon.Check />}
                    >
                      Me
                    </Button.Medium>
                  ) : isFollowed ? (
                    <Button.Medium
                      onClick={() =>
                        unfollowUser(follower.uri.replace('pubky:', ''))
                      }
                      icon={<Icon.UserMinus size="16" />}
                      className="w-[154px]"
                    >
                      Unfollow me
                    </Button.Medium>
                  ) : (
                    <Button.Medium
                      onClick={() =>
                        followUser(follower.uri.replace('pubky:', ''))
                      }
                      icon={<Icon.UserPlus size="16" />}
                      className="w-[154px]"
                    >
                      Follow me
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
