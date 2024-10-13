'use client';

import { useEffect, useState } from 'react';
import {
  Icon,
  Tooltip,
  Post as PostUI,
  Button,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useRouter } from 'next/navigation';
import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import {
  UseUserFollowers,
  UseUserFollowing,
  useUserProfile,
} from '@/hooks/useUser';
import { getUserDetails } from '@/services/userService';

interface ProfileProps {
  post?: PostView;
  profileId?: string | undefined;
}

export default function Profile({ post, profileId }: ProfileProps) {
  const router = useRouter();
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const [followingImages, setFollowingImages] = useState<
    { alt: string; src: string }[]
  >([]);
  const [followersImages, setFollowersImages] = useState<
    { alt: string; src: string }[]
  >([]);
  const idAuthor = post?.details?.author || profileId || '';

  const { data: author } = useUserProfile(idAuthor, pubky ?? '');

  const {
    data: followers,
    isLoading: isLoadingFollowers,
    isError: isErrorFollowers,
  } = UseUserFollowers(idAuthor ?? '', pubky ?? '');
  if (isErrorFollowers) console.error(isErrorFollowers);

  const {
    data: following,
    isLoading: isLoadingFollowing,
    isError: isErrorFollowing,
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
      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const followersList = followers;

        if (followersList) {
          const images = await Promise.all(
            followersList.slice(0, 3).map(async (user, index) => {
              const userDetails = await getUserDetails(user);
              return {
                alt: `userPic-${index + 1}`,
                src: userDetails?.image || '/images/Userpic.png',
              };
            })
          );

          setFollowersImages(images);
          setInitLoadingFollowed(false);

          followersList.forEach((user) => {
            const uri = user.replace('pubky:', '');
            if (uri === pubky) {
              setFollowed(true);
            }
          });
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
                alt: `userPic-${index + 1}`,
                src: userDetails?.image || '/images/Userpic.png',
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
    <Tooltip.Main
      onClick={(event) => event.stopPropagation()}
      className="cursor-default w-[300px]"
    >
      <div className="w-full flex flex-col justify-between">
        <div
          onClick={() => router.push(`/profile/${idAuthor}`)}
          className="justify-start items-center gap-2 flex cursor-pointer"
        >
          <PostUI.ImageUser
            uriImage={author?.details?.image || '/images/Userpic.png'}
            alt="user"
          />
          <div className={`flex flex-col justify-start`}>
            <PostUI.Username
              className={`hover:underline hover:decoration-solid`}
            >
              {author?.details?.name &&
                Utils.minifyText(author?.details?.name, 12)}
            </PostUI.Username>
            <Typography.Label className="text-opacity-30 -mt-1">
              {Utils.minifyPubky(idAuthor)}
            </Typography.Label>
          </div>
        </div>
      </div>
      <Typography.Body
        variant="medium"
        className="scrollbar-thin scrollbar-webkit my-3 text-opacity-80 break-words max-h-[150px] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {author?.details?.bio
          ? Utils.minifyText(author?.details?.bio, 50)
          : 'No bio.'}
      </Typography.Body>
      <div className="grid grid-cols-2 gap-6 justify-start">
        {isLoadingFollowing ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <div
            onClick={(event) => {
              event.stopPropagation();
              ((followers?.length ?? 0) > 0 || (following?.length ?? 0) > 0) &&
                router.push(
                  `/profile/${
                    idAuthor ? `${idAuthor}?tab=following` : '?tab=following'
                  }`
                );
            }}
            className={`flex-col gap-3 inline-flex ${
              (following?.length ?? 0) > 0 && 'cursor-pointer'
            }`}
          >
            <div className="inline-flex gap-2">
              <Typography.Label>{following?.length}</Typography.Label>
              <Typography.Label className="text-opacity-50">
                Following
              </Typography.Label>
            </div>
            {followingImages && <PostUI.UserPic images={followingImages} />}
          </div>
        )}
        {isLoadingFollowers ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <div
            onClick={(event) => {
              event.stopPropagation();
              ((followers?.length ?? 0) > 0 || (following?.length ?? 0) > 0) &&
                router.push(
                  `/profile/${
                    idAuthor ? `${idAuthor}?tab=followers` : '?tab=followers'
                  }`
                );
            }}
            className={`flex-col gap-3 inline-flex ${
              (followers?.length ?? 0) > 0 && 'cursor-pointer'
            }`}
          >
            <div className="inline-flex gap-2">
              <Typography.Label>{followers?.length}</Typography.Label>
              <Typography.Label className="text-opacity-50">
                Followers
              </Typography.Label>
            </div>
            {followersImages && <PostUI.UserPic images={followersImages} />}
          </div>
        )}
      </div>
      <div>
        {followed ? (
          initLoadingFollowed ? (
            <Button.Transparent
              loading={initLoadingFollowed}
              className={
                post?.details?.author === pubky ? 'hidden' : 'w-full mt-3'
              }
            >
              Loading
            </Button.Transparent>
          ) : (
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
              className={
                post?.details?.author === pubky ? 'hidden' : 'w-full mt-3'
              }
            >
              Unfollow
            </Button.Transparent>
          )
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
            className={
              post?.details?.author === pubky ? 'hidden' : 'w-full mt-3'
            }
          >
            Follow
          </Button.Transparent>
        )}
        {post?.details?.author === pubky && (
          <Button.Transparent
            icon={<Icon.Pencil size="16" />}
            onClick={(event) => {
              event.stopPropagation();
              router.push('/settings/edit');
            }}
            className="mt-3"
          >
            Edit profile
          </Button.Transparent>
        )}
      </div>
    </Tooltip.Main>
  );
}
