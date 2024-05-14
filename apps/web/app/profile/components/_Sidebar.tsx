'use client';

import { useRouter } from 'next/navigation';
import { Icon, Typography, Post, SideCard, Button } from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../../contexts/client';
import { Skeleton } from '../../../components';
import { Utils } from '../../../utils';
import { IFollowingResponse, IFollowersResponse } from '../../../types';
import Image from 'next/image';
import { DropDown } from '../../../components/DropDown';
import { Modal } from '../../../components/Modal';

export default function Sidebar({
  creatorPubky,
}: {
  creatorPubky?: string | null;
}) {
  const {
    pubky,
    seed,
    follow,
    unfollow,
    getProfile,
    listFollowers,
    listFollowing,
    getUser,
  } = useClientContext();
  const router = useRouter();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [image, setImage] = useState('/images/Userpic.png');
  const [status, setStatus] = useState('');
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
  const [showModalLogout, setShowModalLogout] = useState(false);
  const [showModalCheckLink, setShowModalCheckLink] = useState(false);
  const [clickedLink, setClickedLink] = useState('');

  useEffect(() => {
    if (seed) {
      setDisposableAccount(true);
    } else {
      setDisposableAccount(false);
    }
  }, [seed]);

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
            followersList.followers.slice(0, 5).map((user) => ({
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
            followingList.following.slice(0, 5).map((user) => ({
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
          if (profile.status && profile.status in Utils.statusHelper.labels) {
            setStatus(profile.status);
          } else {
            setStatus('noStatus');
          }
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
        <div className="w-full">
          <SideCard.Content className="flex-col gap-3 inline-flex">
            <div className="justify-start items-center gap-3 inline-flex">
              <Image
                width={40}
                height={40}
                className="w-[40px] h-[40px] rounded-full"
                src={image}
                alt="user-pic"
              />
              <div>
                <Typography.H2 className="-mb-1">
                  {Utils.minifyText(name, 15)}
                </Typography.H2>
                <Typography.Label className="text-opacity-50">
                  {pubky ? Utils.minifyPubky(pubky) : 'Loading...'}
                </Typography.Label>
              </div>
            </div>
            <Typography.Body
              variant="medium"
              className="text-opacity-80 break-all"
            >
              {Utils.minifyText(bio, 140)}
            </Typography.Body>
            {initLoadingFollowed ? (
              <Button.Medium
                loading={initLoadingFollowed}
                className={
                  !creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-full'
                }
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
                className={
                  !creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-full'
                }
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
                className={
                  !creatorPubky || creatorPubky === pubky ? 'hidden' : 'w-full'
                }
              >
                Follow
              </Button.Medium>
            )}
            {(!creatorPubky || creatorPubky === pubky) && (
              <Link href="/settings">
                <Button.Medium
                  variant="default"
                  icon={<Icon.GearSix size="16" />}
                >
                  Edit profile
                </Button.Medium>
              </Link>
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
        <SideCard.Header title="Contacts" />
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
                Loading Contacts
              </Typography.Body>
            </>
          </SideCard.Content>
        ) : (
          <SideCard.Content className="grid grid-cols-2 gap-12 justify-start">
            {loadingFollowers ? (
              <div className="flex w-full justify-center">
                <Icon.LoadingSpin className="animate-spin text-2xl text-center mx-auto" />
              </div>
            ) : (
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  ((followers?.count ?? 0) > 0 ||
                    (following?.count ?? 0) > 0) &&
                    router.push(
                      `/contacts/${
                        creatorPubky
                          ? `${creatorPubky}?tab=followers`
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
                  ((followers?.count ?? 0) > 0 ||
                    (following?.count ?? 0) > 0) &&
                    router.push(
                      `/contacts/${
                        creatorPubky
                          ? `${creatorPubky}?tab=following`
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
                <Post.UserPic images={followingImages} />
              </div>
            )}
          </SideCard.Content>
        )}
      </div>
      <div>
        {!creatorPubky || creatorPubky === pubky ? (
          <>
            <SideCard.Header title="Status" />
            <DropDown.Status />
          </>
        ) : (
          status &&
          status !== 'noStatus' && (
            <>
              <SideCard.Header title="Status" />
              <div className="mt-2 px-4 py-2 bg-white bg-opacity-10 rounded-full">
                <Typography.Body variant="medium">
                  {
                    Utils.statusHelper.emojis[
                      status as keyof typeof Utils.statusHelper.emojis
                    ]
                  }{' '}
                  {
                    Utils.statusHelper.labels[
                      status as keyof typeof Utils.statusHelper.labels
                    ]
                  }
                </Typography.Body>
              </div>
            </>
          )
        )}
      </div>
      {links.length > 0 && (
        <div className="flex-col inline-flex gap-4">
          <SideCard.Header title="Links" />
          <div className="flex-col inline-flex gap-2">
            {links.map((link, index) => (
              <div key={index}>
                {link.url && (
                  <>
                    <Typography.Label className="text-opacity-50">
                      {link.title}
                    </Typography.Label>
                    {link.title === 'email' || link.title === 'mail' ? (
                      <Link href={`mailto:${link.url}`} target="_blank">
                        <Typography.Body
                          className="hover:text-opacity-80"
                          variant="small-bold"
                        >
                          {link.url}
                        </Typography.Body>
                      </Link>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setShowModalCheckLink(true);
                          setClickedLink(link.url);
                        }}
                      >
                        <Typography.Body
                          className="hover:text-opacity-80"
                          variant="small-bold"
                        >
                          {link.url}
                        </Typography.Body>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {(!creatorPubky || creatorPubky === pubky) && (
        <Button.Medium
          className="w-[200px]"
          onClick={
            disposableAccount
              ? () => setShowModalLogout(true)
              : () => router.push('/logout')
          }
          icon={<Icon.SignOut />}
        >
          Sign out
        </Button.Medium>
      )}
      <Modal.Logout
        showModalLogout={showModalLogout}
        setShowModalLogout={setShowModalLogout}
      />
      <Modal.CheckLink
        showModalCheckLink={showModalCheckLink}
        setShowModalCheckLink={setShowModalCheckLink}
        clickedLink={clickedLink}
      />
    </div>
  );
}
