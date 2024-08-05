'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Icon,
  Typography,
  SideCard,
  Button,
  PostUtil,
} from '@social/ui-shared';
import { useClientContext } from '@/contexts';
import { Skeleton } from '@/components';
import { Utils } from '@social/utils-shared';
import { ITaggedProfile } from '@/types';
import { Modal } from '@/components/Modal';
import Tooltip from '@/components/Tooltip';
import { useRouter } from 'next/navigation';
import Parsing from '@/components/Content/_Parsing';

const socialLinks = [
  {
    name: 'X (twitter)',
    url: 'https://x.com/@',
    icon: <Icon.Twitter size="16" />,
  },
  {
    name: 'Telegram',
    url: 'https://t.me/',
    icon: <Icon.Telegram width="16" height="16" />,
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/',
    icon: <Icon.Discord size="16" />,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/@',
    icon: <Icon.Instagram size="16" />,
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/',
    icon: <Icon.Facebook size="16" />,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/',
    icon: <Icon.LinkedIn size="16" />,
  },
  {
    name: 'Github',
    url: 'https://github.com/',
    icon: <Icon.Github size="16" />,
  },
  {
    name: 'Calendly',
    url: 'https://calendly.com/',
    icon: <Icon.Calendly size="16" />,
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@',
    icon: <Icon.Medium size="16" />,
  },
  {
    name: 'Youtube',
    url: 'https://youtube.com/@',
    icon: <Icon.Youtube width="16" height="16" />,
  },
  {
    name: 'Twitch',
    url: 'https://twitch.tv/',
    icon: <Icon.Twitch size="16" />,
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@',
    icon: <Icon.TikTok size="16" />,
  },
  {
    name: 'Spotify',
    url: 'https://spotify.com/user/',
    icon: <Icon.Spotify size="16" />,
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
    getUser,
    createTag,
    deleteTag,
  } = useClientContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('No bio.');
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [image, setImage] = useState('/images/Userpic.png');
  const [profileTags, setProfileTags] = useState<ITaggedProfile[]>([]);
  const [showModalProfileTag, setShowModalProfileTag] = useState(false);
  //const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const [loadingProfileTags, setLoadingProfileTags] = useState(true);
  const [pubkyUser, setPubkyUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ITaggedProfile | null>(null);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [showModalCheckLink, setShowModalCheckLink] = useState(false);
  const [clickedLink, setClickedLink] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const checkLink = Utils.storage.get('checkLink');
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1100) {
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

  return (
    <>
      <div className="col-span-1 hidden flex-col justify-start items-start gap-8 xl:inline-flex">
        <div
          className={`w-full self-start ${
            !scrolled ? 'border hidden' : 'block sticky top-[120px] border'
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
              <Parsing>{bio}</Parsing>
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
                  <Parsing>{bio}</Parsing>
                </Typography.Body>
              </div>
            </>
          )}
          <div className="w-full">
            <SideCard.Header title="Tagged" />
            {loadingProfileTags ? (
              <Skeleton.Simple />
            ) : (
              <div className="mt-4 justify-start items-start gap-2 flex flex-col">
                {profileTags.length > 0 ? (
                  <>
                    {profileTags.map((tag, index) => {
                      const isTagFound = tag.from.some(
                        (fromItem) => fromItem.author.id === pubky
                      );

                      const images = tag.from.map(
                        (fromItem) => fromItem.author.profile.image
                      );
                      const displayedImages = images.slice(0, 4);
                      const extraImagesCount =
                        images.length - displayedImages.length;

                      return (
                        <div className="flex gap-2" key={index}>
                          {/**<TooltipUI.Root
                            delay={500}
                            setShowTooltip={setShowTooltipProfile}
                            tagId={tag.tag}
                          >
                            {showTooltipProfile === tag.tag && (
                              <Tooltip.Tag
                                setShowModalTags={setShowModalProfileTag}
                                setSelectedTag={setSelectedTag}
                                tags={tag}
                              />
                            )}*/}
                          <PostUtil.Tag
                            key={index}
                            clicked={isTagFound}
                            onClick={(event) => {
                              event.stopPropagation();
                              isTagFound
                                ? handleDeleteProfileTag(tag.tag)
                                : handleAddProfileTag(tag.tag);
                            }}
                            color={
                              tag.tag && Utils.generateRandomColor(tag.tag)
                            }
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(tag.tag.replace(' ', ''), 20)}
                              <Typography.Caption
                                variant="bold"
                                className="text-opacity-30"
                              >
                                {tag.count}
                              </Typography.Caption>
                            </div>
                          </PostUtil.Tag>
                          {/**</div></TooltipUI.Root>*/}
                          <Button.Action
                            variant="custom"
                            size="small"
                            icon={<Icon.MagnifyingGlassLeft size="14" />}
                            onClick={() =>
                              router.push(`/search?tags=${tag.tag}`)
                            }
                            className="cursor-pointer text-fuchsia-500 text-opacity-50 hover:text-opacity-80"
                          />
                          <div
                            onClick={() => setShowModalProfileTag(true)}
                            className="cursor-pointer flex items-center"
                          >
                            {displayedImages.map((image, imageIndex) => (
                              <Image
                                width={32}
                                height={32}
                                key={`${tag.tag}-${imageIndex}`}
                                className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                                  imageIndex > 0 && '-ml-2'
                                }`}
                                alt={`tag-${imageIndex + 1}`}
                                src={image}
                              />
                            ))}
                            {extraImagesCount > 0 && (
                              <PostUtil.Counter className="-ml-2">
                                +{extraImagesCount}
                              </PostUtil.Counter>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <Typography.Body variant="small" className="text-opacity-50">
                    No tags yet
                  </Typography.Body>
                )}
                <Button.Medium
                  className="mt-2 w-auto h-8 inline-flex items-center"
                  onClick={() => setShowModalProfileTag(true)}
                  icon={<Icon.Tag size="16" />}
                >
                  Tag{' '}
                  {!creatorPubky || creatorPubky === pubky
                    ? 'yourself'
                    : Utils.minifyText(name, 22)}
                </Button.Medium>
              </div>
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
                                variant="small"
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
                                variant="small"
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
        </div>
      </div>
      <Modal.CheckLink
        showModalCheckLink={showModalCheckLink}
        setShowModalCheckLink={setShowModalCheckLink}
        clickedLink={clickedLink}
      />
      <Modal.ProfileTag
        profileTags={profileTags}
        showModalProfileTag={showModalProfileTag}
        setShowModalProfileTag={setShowModalProfileTag}
        handleAddProfileTag={handleAddProfileTag}
        handleDeleteProfileTag={handleDeleteProfileTag}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        pubkyUser={pubkyUser}
        name={name}
        image={image}
      />
    </>
  );
}
