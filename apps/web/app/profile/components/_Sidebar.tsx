'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  Icon,
  Typography,
  Post,
  SideCard,
  Button,
  PostUtil,
  Tooltip as TooltipUI,
} from '@social/ui-shared';
import { useClientContext, useAlertContext } from '@/contexts';
import { Skeleton } from '@/components';
import { Utils } from '@social/utils-shared';
import {
  IFollowingResponse,
  IFollowersResponse,
  ITaggedProfile,
} from '@/types';
import { Modal } from '@/components/Modal';
import Skeletons from '@/components/Skeletons';
import Tooltip from '@/components/Tooltip';

const socialLinks = [
  {
    name: 'X (twitter)',
    url: 'https://x.com/@',
    icon: <Icon.Twitter size="16" />,
  },
  { name: 'Telegram', url: 'https://t.me/', icon: <Icon.Telegram size="16" /> },
  {
    name: 'Discord',
    url: 'https://discord.gg/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/@',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Github',
    url: 'https://github.com/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Calendly',
    url: 'https://calendly.com/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Vimeo',
    url: 'https://vimeo.com/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Youtube',
    url: 'https://youtube.com/@',
    icon: <Icon.Youtube size="16" />,
  },
  {
    name: 'Twitch',
    url: 'https://twitch.tv/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Pinterest',
    url: 'https://pinterest.com/',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@',
    icon: <Icon.Link size="16" />,
  },
  {
    name: 'Spotify',
    url: 'https://spotify.com/user/',
    icon: <Icon.Link size="16" />,
  },
];

const linkTitleToIconMap: { [key: string]: JSX.Element } = {
  email: <Icon.Envelope size="16" />,
  mail: <Icon.Envelope size="16" />,
};

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
    createTag,
    deleteTag,
  } = useClientContext();
  const { setContent, setShow } = useAlertContext();
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
  const [loadingAddProfileTags, setLoadingAddProfileTags] = useState(false);
  const [pubkyUser, setPubkyUser] = useState('');
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
  const [showModalCheckLink, setShowModalCheckLink] = useState(false);
  const [clickedLink, setClickedLink] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const checkLink = Utils.storage.get('checkLink');
  const [scrolled, setScrolled] = useState(false);
  const signOutButtonRef = useRef(null);
  const [isSignOutVisible, setIsSignOutVisible] = useState(true);

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
      await createTag(pubKeyToUse, tag);
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
    try {
      setLoadingAddProfileTags(true);

      for (const tag of arrayTags) {
        await handleAddProfileTag(tag);
      }

      setContent('Profile tags added!');
      setShow(true);

      setLoadingAddProfileTags(false);
    } catch (err) {
      console.error(err);
      setLoadingAddProfileTags(false);
      setContent('Profile tags added!');
      setShow(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (window.scrollY > 500) {
          setIsSignOutVisible(entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );
    if (signOutButtonRef.current) {
      observer.observe(signOutButtonRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="col-span-1 hidden flex-col justify-start items-start gap-8 xl:inline-flex">
        <div
          className={`w-full self-start ${
            isSignOutVisible
              ? 'border-0 hidden'
              : 'block sticky top-[120px] border'
          } ${
            !scrolled && 'border-0'
          } border-white border-opacity-10 z-20 rounded-2xl px-3 py-4`}
        >
          <SideCard.Content className="flex-col gap-3 inline-flex mt-0">
            <div className="items-center inline-flex justify-between">
              <div className="justify-start items-center gap-3 inline-flex">
                <Image
                  width={50}
                  height={50}
                  className="w-[50px] h-[50px] rounded-full"
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
                    creatorPubky={pubkyUser}
                  />
                )}
                <div
                  className="cursor-pointer rounded-full hover:bg-white hover:bg-opacity-10 p-2 -mt-[10px]"
                  onClick={() => setShowProfileMenu(true)}
                >
                  <Icon.DotsThreeOutline size="20" />
                </div>
              </div>
            </div>
            <Typography.Body
              variant="medium"
              className="text-opacity-80 break-words max-h-[300px] overflow-y-auto"
            >
              {Utils.minifyText(bio, 160)}
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
            {/* {(!creatorPubky || creatorPubky === pubky) && (
                <Link href="/settings">
                  <Button.Medium
                    variant="default"
                    icon={<Icon.GearSix size="16" />}
                  >
                    Edit profile
                  </Button.Medium>
                </Link>
              )} */}
          </SideCard.Content>
        </div>
        <div className="w-full flex-col justify-start items-start gap-8 xl:inline-flex lg:ml-3">
          {loading ? (
            <div className="w-full">
              <SideCard.Header title="Bio" />
              <Skeleton.Simple />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <SideCard.Header title="Bio" />
                <Typography.Body
                  variant="medium"
                  className="text-opacity-80 break-words max-h-[300px] overflow-y-auto"
                >
                  {Utils.minifyText(bio, 160)}
                </Typography.Body>
              </div>
            </>
          )}
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
                            onClick={(event) => {
                              event.stopPropagation();
                              isTagFound
                                ? handleDeleteProfileTag(tag.tag)
                                : handleAddProfileTag(tag.tag);
                            }}
                            color="fuchsia"
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(tag.tag.replace(' ', ''), 7)}
                              <Typography.Caption
                                variant="bold"
                                className="text-opacity-30"
                              >
                                {tag.count}
                              </Typography.Caption>
                            </div>
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
                  <div className={`flex-col gap-3 inline-flex`}>
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
                  <div className={`flex-col gap-3 inline-flex`}>
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
          {links.length > 0 && (
            <div className="flex-col inline-flex gap-2">
              <SideCard.Header title="Links" />
              <div className="flex-col inline-flex gap-2">
                {links.map((link, index) => {
                  const icon = socialLinks.find((socialLink) =>
                    link.url.includes(socialLink.url)
                  )?.icon;
                  const customIcon =
                    linkTitleToIconMap[link.title.toLowerCase()];

                  return (
                    <div key={index} className="flex gap-2 items-center">
                      {link.url && (
                        <>
                          {customIcon ? (
                            customIcon
                          ) : icon ? (
                            icon
                          ) : (
                            <Icon.Link size="16" />
                          )}
                          {link.title.toLocaleLowerCase() === 'email' ||
                          link.title.toLocaleLowerCase() === 'mail' ? (
                            <Link href={`mailto:${link.url}`} target="_blank">
                              <Typography.Body
                                className="text-opacity-80 hover:text-opacity-100"
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
                                className="text-opacity-80 hover:text-opacity-100"
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
                  );
                })}
              </div>
            </div>
          )}
          <div ref={signOutButtonRef} />
        </div>
      </div>
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
        loadingAddProfileTags={loadingAddProfileTags}
      />
    </>
  );
}
