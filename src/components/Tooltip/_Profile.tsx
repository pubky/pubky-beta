'use client';

import { useEffect, useState } from 'react';
import { Icon, Tooltip, Post as PostUI, Button, Typography, PostUtil } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { UseUserFollowers, UseUserFollowing, useUserProfile } from '@/hooks/useUser';
import { getUserDetails } from '@/services/userService';
import Link from 'next/link';
import Parsing from '../Content/_Parsing';

interface ProfileProps {
  post?: PostView;
  profileId?: string | undefined;
}

export default function Profile({ post, profileId }: ProfileProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [followingImages, setFollowingImages] = useState<{ id: string; alt: string }[]>([]);
  const [followersImages, setFollowersImages] = useState<{ id: string; alt: string }[]>([]);
  const idAuthor = post?.details?.author || profileId || '';

  const { data: author } = useUserProfile(idAuthor, pubky ?? '');

  const {
    data: followers,
    isLoading: isLoadingFollowers,
    isError: isErrorFollowers
  } = UseUserFollowers(idAuthor ?? '');
  if (isErrorFollowers) console.error(isErrorFollowers);

  const {
    data: following,
    isLoading: isLoadingFollowing,
    isError: isErrorFollowing
  } = UseUserFollowing(idAuthor ?? '');
  if (isErrorFollowing) console.error(isErrorFollowing);

  const [followed, setFollowed] = useState(false);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);

  const followUser = async () => {
    try {
      if (!idAuthor) return;
      setLoadingFollowed(true);

      const result = await follow(idAuthor);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed(result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!idAuthor) return;
      setLoadingFollowed(true);

      const result = await unfollow(idAuthor);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (author) {
          setInitLoadingFollowed(false);
          if (author?.relationship?.following) setFollowed(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author]);

  useEffect(() => {
    async function fetchData() {
      try {
        const followersList = followers;

        if (followersList) {
          const images = await Promise.all(
            followersList.slice(0, 3).map(async (user, index) => {
              const userDetails = await getUserDetails(user);
              return {
                id: userDetails.id,
                alt: `userPic-${index + 1}`
              };
            })
          );

          setFollowersImages(images);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followers]);

  useEffect(() => {
    async function fetchData() {
      try {
        const followingList = following;

        if (followingList) {
          const images = await Promise.all(
            followingList.slice(0, 3).map(async (user, index) => {
              const userDetails = await getUserDetails(user);
              return {
                id: userDetails?.id,
                alt: `userPic-${index + 1}`
              };
            })
          );

          setFollowingImages(images);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [following]);

  return (
    <Tooltip.Main onClick={(event) => event.stopPropagation()} className="cursor-default w-[320px]">
      <div className="w-full flex flex-col justify-between">
        <Link href={`/profile/${idAuthor}`} className="justify-start items-center gap-2 flex cursor-pointer">
          <PostUI.ImageUser id={idAuthor} alt="user" />
          <div className={`flex flex-col justify-start`}>
            <PostUI.Username className={`hover:underline hover:decoration-solid`}>
              {author?.details?.name && Utils.minifyText(author?.details?.name, 18)}
            </PostUI.Username>
            <Typography.Label className="text-opacity-30 -mt-1">{Utils.minifyPubky(idAuthor)}</Typography.Label>
          </div>
        </Link>
      </div>
      <Typography.Body
        variant="medium"
        className="my-3 text-opacity-80 break-words max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-webkit"
        onClick={(event) => event.stopPropagation()}
      >
        <Parsing>{author?.details?.bio ? Utils.truncateText(author?.details?.bio, 80) : 'No bio.'}</Parsing>
      </Typography.Body>
      <div className="grid grid-cols-2 gap-6 justify-start">
        {isLoadingFollowing || !following ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <Link
            onClick={(event) => {
              event.stopPropagation();
            }}
            href={
              ((followers?.length ?? 0) > 0 || (following?.length ?? 0) > 0) && pubky
                ? `/profile/${idAuthor ? `${idAuthor}/following` : '/following'}`
                : ''
            }
            className={`flex-col gap-3 inline-flex ${(following?.length ?? 0) > 0 && 'cursor-pointer'}`}
          >
            <div className="inline-flex gap-2">
              <Typography.Label>{following?.length}</Typography.Label>
              <Typography.Label className="text-opacity-50">Following</Typography.Label>
            </div>
            <div className="flex flex-wrap">
              {followingImages && <PostUI.UserPic images={followingImages} />}
              {following?.length > 3 && <PostUtil.Counter className="-ml-2">+{following?.length - 3}</PostUtil.Counter>}
            </div>
          </Link>
        )}
        {isLoadingFollowers || !followers ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <Link
            onClick={(event) => {
              event.stopPropagation();
            }}
            href={
              ((followers?.length ?? 0) > 0 || (following?.length ?? 0) > 0) && pubky
                ? `/profile/${idAuthor ? `${idAuthor}/followers` : '/followers'}`
                : ''
            }
            className={`flex-col gap-3 inline-flex ${(followers?.length ?? 0) > 0 && 'cursor-pointer'}`}
          >
            <div className="inline-flex gap-2">
              <Typography.Label>{followers?.length}</Typography.Label>
              <Typography.Label className="text-opacity-50">Followers</Typography.Label>
            </div>
            <div className="flex flex-wrap">
              {followersImages && <PostUI.UserPic images={followersImages} />}
              {followers?.length > 3 && <PostUtil.Counter className="-ml-2">+{followers?.length - 3}</PostUtil.Counter>}
            </div>
          </Link>
        )}
      </div>
      <div>
        {idAuthor === pubky && (
          <Link
            onClick={(event) => {
              event.stopPropagation();
            }}
            href="/settings/edit"
          >
            <Button.Transparent icon={<Icon.Pencil size="16" />} className="mt-3">
              Edit profile
            </Button.Transparent>
          </Link>
        )}
        {pubky && (
          <>
            {initLoadingFollowed ? (
              <Button.Transparent
                loading={initLoadingFollowed}
                className={idAuthor === pubky ? 'hidden' : 'w-full mt-3'}
              >
                Loading
              </Button.Transparent>
            ) : followed ? (
              <Button.Transparent
                onClick={
                  loadingFollowed
                    ? undefined
                    : (event) => {
                        event.stopPropagation();
                        unfollowUser();
                      }
                }
                disabled={loadingFollowed}
                loading={loadingFollowed}
                icon={<Icon.UserMinus size="16" />}
                className={idAuthor === pubky ? 'hidden' : 'w-full mt-3'}
              >
                Unfollow
              </Button.Transparent>
            ) : (
              <Button.Transparent
                onClick={
                  loadingFollowed
                    ? undefined
                    : (event) => {
                        event.stopPropagation();
                        followUser();
                      }
                }
                disabled={loadingFollowed}
                loading={loadingFollowed}
                icon={<Icon.UserPlus size="16" />}
                className={idAuthor === pubky ? 'hidden' : 'w-full mt-3'}
              >
                Follow
              </Button.Transparent>
            )}
          </>
        )}
      </div>
    </Tooltip.Main>
  );
}
