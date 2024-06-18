'use client';

import { useRouter } from 'next/navigation';
import {
  Icon,
  Typography,
  Post,
  SideCard,
  Button,
  PostUtil,
  Tooltip as TooltipUI,
} from '@social/ui-shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useClientContext } from '../../../contexts/client';
import { useAlertContext } from '../../../contexts/alerts';
import { Skeleton } from '../../../components';
import { Utils } from '../../../utils';
import {
  IFollowingResponse,
  IFollowersResponse,
  ITaggedProfile,
} from '../../../types';
import Image from 'next/image';
import { DropDown } from '../../../components/DropDown';
import { Modal } from '../../../components/Modal';
import Skeletons from '../../../components/Skeletons';
import Tooltip from '../../../components/Tooltip';

const socialLinks = [
  { name: 'X (twitter)', url: 'https://x.com/@' },
  { name: 'Telegram', url: 'https://t.me/' },
  { name: 'Discord', url: 'https://discord.gg/' },
  { name: 'Instagram', url: 'https://instagram.com/@' },
  { name: 'Facebook', url: 'https://facebook.com/' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/' },
  { name: 'Github', url: 'https://github.com/' },
  { name: 'Calendly', url: 'https://calendly.com/' },
  { name: 'Vimeo', url: 'https://vimeo.com/' },
  { name: 'Youtube', url: 'https://youtube.com/@' },
  { name: 'Twitch', url: 'https://twitch.tv/' },
  { name: 'Pinterest', url: 'https://pinterest.com/' },
  { name: 'TikTok', url: 'https://tiktok.com/@' },
  { name: 'Spotify', url: 'https://spotify.com/user/' },
];

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
    createTag,
    deleteTag,
  } = useClientContext();
  const router = useRouter();
  const { setContent, setShow } = useAlertContext();
  const [disposableAccount, setDisposableAccount] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [image, setImage] = useState('/images/Userpic.png');
  const [profileTags, setProfileTags] = useState<ITaggedProfile[]>([]);
  const [showModalTags, setShowModalTags] = useState(false);
  const [showModalProfileTag, setShowModalProfileTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ITaggedProfile | null>();
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const [arrayTags, setArrayTags] = useState<string[]>([]);
  const [loadingProfileTags, setLoadingProfileTags] = useState(true);
  const [pubkyUser, setPubkyUser] = useState('');
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const checkLink = Utils.storage.get('checkLink');

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

  async function fetchProfile() {
    try {
      let profile = null;
      if (creatorPubky) {
        const userProfile = await getUser(creatorPubky);

        if (userProfile) {
          profile = userProfile?.profile;
          setPubkyUser(creatorPubky);
          setProfileTags(userProfile?.taggedAs);
        }
      } else {
        if (!pubky) return;
        const userProfile = await getUser(pubky);
        setPubkyUser(pubky || '');

        if (userProfile) {
          profile = userProfile.profile;
          setProfileTags(userProfile?.taggedAs);
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
      setLoadingProfileTags(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderSocialUsername = (linkUrl: string) => {
    const matchingSocialLink = socialLinks.find((socialLink) =>
      linkUrl.includes(socialLink.url)
    );

    if (matchingSocialLink) {
      const usernameStartIndex = linkUrl.lastIndexOf('/') + 1;
      const username = linkUrl.substring(usernameStartIndex);
      if (username) return username;
    }

    return linkUrl || '';
  };

  const handleAddProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      const result = await createTag(pubKeyToUse, tag);
      if (result) {
        setContent('Profile tags added!');
        setShow(true);
      } else {
        setContent('Something wrong. Try again', 'warning');
        setShow(true);
      }
      fetchProfile();
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    const pubKeyToUse =
      (!creatorPubky || creatorPubky === pubky) && pubky ? pubky : creatorPubky;

    if (pubKeyToUse) {
      await deleteTag(pubKeyToUse, tag);
      fetchProfile();
    }
  };

  const AddTags = async () => {
    for (const tag of arrayTags) {
      await handleAddProfileTag(tag);
    }
  };

  return (
    <>
      <div className="col-span-1 hidden flex-col justify-start items-start gap-8 xl:inline-flex">
        {loading ? (
          <div className="w-full flex-col justify-start items-start xl:inline-flex lg:ml-3">
            <SideCard.Header title="Profile" />
            <Skeleton.Simple />
          </div>
        ) : (
          <div className="w-full self-start sticky top-[160px] backdrop-blur-3xl z-20 rounded-2xl px-3 py-4">
            <SideCard.Content className="flex-col gap-3 inline-flex mt-0">
              <div className="items-center inline-flex justify-between">
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
                      {pubkyUser ? Utils.minifyPubky(pubkyUser) : 'Loading...'}
                    </Typography.Label>
                  </div>
                </div>
                <div className="relative">
                  {showProfileMenu && (
                    <Tooltip.ProfileMenu
                      setShowProfileMenu={setShowProfileMenu}
                      pubky={pubkyUser}
                    />
                  )}
                  <div
                    className="cursor-pointer rounded-full hover:bg-white hover:bg-opacity-10"
                    onClick={() => setShowProfileMenu(true)}
                  >
                    <Icon.DotsThree size="28" />
                  </div>
                </div>
              </div>
              <Typography.Body
                variant="medium"
                className="text-opacity-80 break-all"
              >
                {Utils.minifyText(bio, 160)}
              </Typography.Body>
              {initLoadingFollowed ? (
                <Button.Medium
                  loading={initLoadingFollowed}
                  className={
                    !creatorPubky || creatorPubky === pubky
                      ? 'hidden'
                      : 'w-full'
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
                    !creatorPubky || creatorPubky === pubky
                      ? 'hidden'
                      : 'w-full'
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
                    !creatorPubky || creatorPubky === pubky
                      ? 'hidden'
                      : 'w-full'
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
        <div className="w-full flex-col justify-start items-start gap-8 xl:inline-flex lg:ml-3">
          <div className="w-full">
            <SideCard.Header title="Tagged as" />
            {loadingProfileTags ? (
              <Skeleton.Simple />
            ) : (
              <div className="mt-4 justify-start items-start gap-2 flex flex-wrap">
                {profileTags.length > 0 ? (
                  <>
                    {profileTags.map((tag, index) => {
                      const isTagFound = tag.from.some(
                        (fromItem) => fromItem.author.id === pubky
                      );
                      return (
                        <TooltipUI.Root
                          key={index}
                          delay={200}
                          setShowTooltip={setShowTooltipProfile}
                          tagId={tag.tag}
                        >
                          {showTooltipProfile === tag.tag && (
                            <Tooltip.Tag
                              setSelectedTag={setSelectedTag}
                              setShowModalTags={setShowModalTags}
                              tags={tag}
                            />
                          )}
                          <PostUtil.Tag
                            key={index}
                            clicked={isTagFound}
                            onClick={() => {
                              setShowModalTags(true);
                              setSelectedTag(tag);
                            }}
                            color="fuchsia"
                            className="flex flex-col pl-9"
                          >
                            <Button.Action
                              variant="custom"
                              size="small"
                              className="absolute -left-9 transform -translate-y-[21px] scale-75"
                              icon={isTagFound ? <Icon.Minus /> : <Icon.Plus />}
                              onClick={(event) => {
                                event.stopPropagation();
                                isTagFound
                                  ? handleDeleteProfileTag(tag.tag)
                                  : handleAddProfileTag(tag.tag);
                              }}
                            />
                            {Utils.minifyText(tag.tag.replace(' ', ''))} (
                            {tag.count})
                          </PostUtil.Tag>
                        </TooltipUI.Root>
                      );
                    })}{' '}
                    <Button.Action
                      variant="custom"
                      size="small"
                      icon={<Icon.ListBullets />}
                      onClick={() => setShowModalTags(true)}
                      className="cursor-pointer text-fuchsia-500 text-opacity-50 hover:text-opacity-80"
                    />
                  </>
                ) : (
                  <Typography.Body
                    variant="small"
                    className="flex self-center text-opacity-50"
                  >
                    No tags yet
                  </Typography.Body>
                )}
                <Button.Action
                  variant="custom"
                  size="small"
                  icon={<Icon.Tag />}
                  onClick={() => setShowModalProfileTag(true)}
                  className="cursor-pointer text-fuchsia-500 text-opacity-50 hover:text-opacity-80"
                />
              </div>
            )}
          </div>
          <div className="w-full">
            <SideCard.Header title="Contacts" />
            {loadingFollowers ? (
              <Skeletons.Simple />
            ) : (
              <SideCard.Content className="grid grid-cols-2 gap-12 justify-start mt-2">
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
          {!creatorPubky || creatorPubky === pubky ? (
            <div className="flex flex-col gap-2">
              <SideCard.Header title="Status" />
              <DropDown.Status />
            </div>
          ) : (
            status &&
            status !== 'noStatus' && (
              <div>
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
              </div>
            )
          )}
          {links.length > 0 && (
            <div className="flex-col inline-flex gap-1">
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
                            onClick={
                              checkLink === false
                                ? () => window.open(link.url, '_blank')
                                : () => {
                                    setShowModalCheckLink(true);
                                    setClickedLink(link.url);
                                  }
                            }
                          >
                            <Typography.Body
                              className="hover:text-opacity-80"
                              variant="small-bold"
                            >
                              {Utils.minifyText(
                                renderSocialUsername(link.url),
                                50
                              )}
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
        </div>
      </div>
      <Modal.Logout
        showModalLogout={showModalLogout}
        setShowModalLogout={setShowModalLogout}
      />
      <Modal.CheckLink
        showModalCheckLink={showModalCheckLink}
        setShowModalCheckLink={setShowModalCheckLink}
        clickedLink={clickedLink}
      />
      <Modal.ProfileTags
        tagsProfile={profileTags}
        showModalTags={showModalTags}
        setShowModalTags={setShowModalTags}
        handleAddTag={handleAddProfileTag}
        handleDeleteTag={handleDeleteProfileTag}
        tag={selectedTag}
      />
      <Modal.ProfileTag
        arrayTags={arrayTags}
        setArrayTags={setArrayTags}
        showModalProfileTag={showModalProfileTag}
        setShowModalProfileTag={setShowModalProfileTag}
        AddTags={AddTags}
      />
    </>
  );
}
