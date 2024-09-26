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
import {
  IPost,
  IFollowingResponse,
  IFollowersResponse,
  IPostFrom,
} from '@/types';
import { useRouter } from 'next/navigation';
import { usePubkyClientContext } from '@/contexts';

interface ProfileProps {
  post: IPost | IPostFrom;
}

export default function Profile({ post }: ProfileProps) {
  const { pubky } = usePubkyClientContext();
  // const { pubky, follow, unfollow, listFollowers, listFollowing } = useClientContext();
  const router = useRouter();

  const [followed, setFollowed] = useState(false);
  const [following, setFollowing] = useState<IFollowingResponse | null>(null);
  const [followers, setFollowers] = useState<IFollowersResponse | null>(null);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [followingImages, setFollowingImages] = useState<
    { alt: string; src: string }[]
  >([]);
  const [followersImages, setFollowersImages] = useState<
    { alt: string; src: string }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey;

        if (post?.author?.id) {
          pubkey = post?.author?.id;
        }

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followersList = null; //await listFollowers(pubkey);

        if (followersList) {
          setFollowersImages(
            followersList.followers.slice(0, 3).map((user) => ({
              alt: 'user-pic',
              src: user?.profile?.image || '/images/Userpic.png',
            }))
          );
          setFollowers(followersList);
          setLoadingFollowers(false);
          setInitLoadingFollowed(false);

          followersList.followers.forEach((user) => {
            const uri = user.uri.replace('pubky:', '');
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
  }, [followed, post?.author?.id]);

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey;

        if (post?.author?.id) {
          pubkey = post?.author?.id;
        }

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followingList = null; //await listFollowing(pubkey);

        if (followingList) {
          setFollowingImages(
            followingList.following.slice(0, 3).map((user) => ({
              alt: 'user-pic',
              src: user?.profile?.image || '/images/Userpic.png',
            }))
          );
          setFollowing(followingList);
          setLoadingFollowing(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.author?.id]);

  const followUser = async () => {
    try {
      if (!post?.author?.id) return;
      setLoadingFollowed(true);

      const result = null; //await follow(post?.author?.id);
      setFollowed(result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!post?.author?.id) return;
      setLoadingFollowed(true);

      const result = null; //await unfollow(post?.author?.id);
      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Tooltip.Main
      onClick={(event) => event.stopPropagation()}
      className="cursor-default w-[300px]"
    >
      <div className="w-full flex flex-col justify-between">
        <div
          onClick={() => router.push(`/profile/${post?.author?.id}`)}
          className="justify-start items-center gap-2 flex cursor-pointer"
        >
          <PostUI.ImageUser
            uriImage={post?.author?.profile?.image || '/images/Userpic.png'}
            alt="user"
          />
          <div className={`flex flex-col justify-start`}>
            <PostUI.Username
              className={`hover:underline hover:decoration-solid`}
            >
              {post?.author?.profile?.name &&
                Utils.minifyText(post?.author?.profile?.name, 12)}
            </PostUI.Username>
            <Typography.Label className="text-opacity-30 -mt-1">
              {Utils.minifyPubky(post?.author?.id)}
            </Typography.Label>
          </div>
        </div>
      </div>
      <Typography.Body
        variant="medium"
        className="scrollbar-thin scrollbar-webkit my-3 text-opacity-80 break-words max-h-[150px] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {post?.author?.profile?.bio
          ? Utils.minifyText(post?.author?.profile?.bio, 50)
          : 'No bio.'}
      </Typography.Body>
      <div className="grid grid-cols-2 gap-6 justify-start">
        {loadingFollowing ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <div
            onClick={(event) => {
              event.stopPropagation();
              ((followers?.count ?? 0) > 0 || (following?.count ?? 0) > 0) &&
                router.push(
                  `/profile/${
                    post?.author?.id
                      ? `${post?.author?.id}?tab=following`
                      : '?tab=following'
                  }`
                );
            }}
            className={`flex-col gap-3 inline-flex ${
              (following?.count ?? 0) > 0 && 'cursor-pointer'
            }`}
          >
            <div className="inline-flex gap-2">
              <Typography.Label>{following?.count}</Typography.Label>
              <Typography.Label className="text-opacity-50">
                Following
              </Typography.Label>
            </div>
            <PostUI.UserPic images={followingImages} />
          </div>
        )}
        {loadingFollowers ? (
          <div className="flex w-full justify-center min-h-[64px] items-center">
            <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
          </div>
        ) : (
          <div
            onClick={(event) => {
              event.stopPropagation();
              ((followers?.count ?? 0) > 0 || (following?.count ?? 0) > 0) &&
                router.push(
                  `/profile/${
                    post?.author?.id
                      ? `${post?.author?.id}?tab=followers`
                      : '?tab=followers'
                  }`
                );
            }}
            className={`flex-col gap-3 inline-flex ${
              (followers?.count ?? 0) > 0 && 'cursor-pointer'
            }`}
          >
            <div className="inline-flex gap-2">
              <Typography.Label>{followers?.count}</Typography.Label>
              <Typography.Label className="text-opacity-50">
                Followers
              </Typography.Label>
            </div>
            <PostUI.UserPic images={followersImages} />
          </div>
        )}
      </div>
      <div>
        {initLoadingFollowed ? (
          <Button.Transparent
            loading={initLoadingFollowed}
            className={post?.author?.id === pubky ? 'hidden' : 'w-full mt-3'}
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
            className={post?.author?.id === pubky ? 'hidden' : 'w-full mt-3'}
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
            className={post?.author?.id === pubky ? 'hidden' : 'w-full mt-3'}
          >
            Follow
          </Button.Transparent>
        )}
        {post?.author?.id === pubky && (
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
