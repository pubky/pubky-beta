'use client';

import { useRouter } from 'next/navigation';
import { Icon, Typography, Post, SideCard, Button } from '@social/ui-shared';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { minifyPubky } from '../../../libs/pubkyHelper';
import { minifyText } from '../../../libs/textHelper';
import { useClientContext } from '../../../contexts/client';
import { Skeleton } from '../../components';
import { IFollowingResponse, IFollowersResponse } from '../../../types';

export default function Sidebar({
  creatorPubky,
}: {
  creatorPubky?: string | null;
}) {
  const {
    pubky,
    follow,
    unfollow,
    getProfile,
    listFollowers,
    listFollowing,
    getUser,
  } = useClientContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [image, setImage] = useState('/images/Userpic.png');
  const [loading, setLoading] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [following, setFollowing] = useState<IFollowingResponse | null>(null);
  const [followers, setFollowers] = useState<IFollowersResponse | null>(null);
  const [followersImages, setFollowersImages] = useState<
    { alt: string; src: string }[]
  >([]);
  const [followingImages, setFollowingImages] = useState<
    { alt: string; src: string }[]
  >([]);
  const [followed, setFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey = creatorPubky;

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followersList = await listFollowers(pubkey);

        if (followersList) {
          setFollowersImages(
            followersList.followers.map((user) => ({
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
  }, [followed, creatorPubky]);

  useEffect(() => {
    async function fetchData() {
      try {
        let pubkey = creatorPubky;

        if (!pubkey) {
          pubkey = pubky;
        }

        if (!pubkey) return;

        const followingList = await listFollowing(pubkey);

        if (followingList) {
          setFollowingImages(
            followingList.following.map((user) => ({
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
  }, [creatorPubky]);

  useEffect(() => {
    async function fetchData() {
      try {
        let profile = null;
        if (creatorPubky) {
          const userProfile = await getUser(creatorPubky);

          if (userProfile) {
            profile = userProfile?.profile;
          }
        } else {
          const userProfile = await getProfile();

          if (userProfile) {
            profile = userProfile;
          }
        }

        if (profile) {
          setName(profile?.name || '');
          setBio(profile?.bio || 'No bio.');
          setImage(profile?.image || '/images/Userpic.png');
          setLinks(
            profile?.links.map((link) => ({ title: link.title, url: link.url }))
          );

          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [pubky, getProfile, getUser, creatorPubky]);

  const followUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingFollowed(true);

      const result = await follow(creatorPubky);
      setFollowed(result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingFollowed(true);

      const result = await unfollow(creatorPubky);
      setFollowed(!result);
      setLoadingFollowed(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="self-start sticky top-[160px] col-span-1 hidden flex-col justify-start items-start gap-6 xl:inline-flex">
      {loading ? (
        <Skeleton.ProfileSidebar />
      ) : (
        <div>
          <SideCard.Header title="profile" variantTitle="label" />
          <SideCard.Content className="flex-col gap-3 inline-flex">
            <div className="justify-start items-center gap-3 inline-flex">
              <Image
                width={32}
                height={32}
                className="w-[32px] h-[32px] rounded-full"
                src={image}
                alt="user-pic"
              />
              <Typography.H2>{minifyText(name, 15)}</Typography.H2>
            </div>
            <Typography.Label className="text-opacity-50">
              {pubky ? minifyPubky(pubky) : 'Loading...'}
            </Typography.Label>
            <Typography.Body
              variant="medium"
              className="text-opacity-80 break-all"
            >
              {minifyText(bio, 140)}
            </Typography.Body>
            {initLoadingFollowed ? (
              <Button.Medium
                loading={initLoadingFollowed}
                className={creatorPubky === pubky ? 'hidden' : ''}
              >
                Loading
              </Button.Medium>
            ) : followed ? (
              <Button.Medium
                onClick={loadingFollowed ? undefined : () => unfollowUser()}
                disabled={loadingFollowed}
                loading={loadingFollowed}
                variant="default"
                icon={<Icon.UserMinus size="16" />}
                className={creatorPubky === pubky ? 'hidden' : ''}
              >
                Unfollow
              </Button.Medium>
            ) : (
              <Button.Medium
                onClick={loadingFollowed ? undefined : () => followUser()}
                disabled={loadingFollowed}
                loading={loadingFollowed}
                variant="default"
                icon={<Icon.UserPlus size="16" />}
                className={creatorPubky === pubky ? 'hidden' : ''}
              >
                Follow
              </Button.Medium>
            )}
          </SideCard.Content>
        </div>
      )}
      {/**<div>
        <SideCard.Header title="Tagged as" variantTitle="label" />
        <SideCard.Content>
          <div className="flex-col gap-3 inline-flex">
            <Post.Footer className="mt-0">
              <PostUtil.Tag clicked color="amber">
                #Bitcoin
              </PostUtil.Tag>
              <Button.Action
                variant="custom"
                size="small"
                icon={<Icon.Plus />}
              />
              <PostUtil.Counter counter={0} />
             <Post.UserPic images={images} />
            </Post.Footer>
          </div>
        </SideCard.Content>
      </div> */}
      <div>
        <SideCard.Header title="Contacts" variantTitle="label" />
        {loadingFollowers ? (
          <SideCard.Content>
            <>
              <div className="flex w-full justify-center">
                <Icon.LoadingSpin className="animate-spin text-4xl text-center mx-auto" />
              </div>
              <Typography.Body
                variant="medium-bold"
                className="col-span-3 m-2 flex justify-center items-center gap-6 text-opacity-20"
              >
                Loading Followers
              </Typography.Body>
            </>
          </SideCard.Content>
        ) : (
          <SideCard.Content className="flex-row gap-20 justify-start inline-flex">
            {loadingFollowers ? (
              <div className="flex w-full justify-center">
                <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
              </div>
            ) : (
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  (followers?.count ?? 0) > 0 &&
                    router.push(
                      `/followers/${creatorPubky ? creatorPubky : ''}`
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
                <Post.UserPic images={followersImages} />
              </div>
            )}
            {loadingFollowing ? (
              <div className="flex w-full justify-center">
                <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
              </div>
            ) : (
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  (following?.count ?? 0) > 0 &&
                    router.push(
                      `/following/${creatorPubky ? creatorPubky : ''}`
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
                <Post.UserPic images={followingImages} />
              </div>
            )}
          </SideCard.Content>
        )}
      </div>
      {links.map((link, index) => (
        <div key={index}>
          <Typography.Label className="text-opacity-50">
            {link.title}
          </Typography.Label>
          <Link href={link.url} target="_blank">
            <Typography.Body
              className="hover:text-opacity-80"
              variant="small-bold"
            >
              {link.url}
            </Typography.Body>
          </Link>
        </div>
      ))}
    </div>
  );
}
