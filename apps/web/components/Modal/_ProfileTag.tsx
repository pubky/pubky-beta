'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Icon,
  Button,
  PostUtil,
  Modal,
  Input,
  Typography,
  SideCard,
} from '@social/ui-shared';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '../ImageByUri';
import { UserTags, UserView } from '@/types/User';
import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import { PostTag } from '@/types/Post';
import Link from 'next/link';

interface ProfileTagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalProfileTag: boolean;
  setShowModalProfileTag: React.Dispatch<React.SetStateAction<boolean>>;
  profileTags: UserTags[];
  handleAddProfileTag: (tag: string) => void;
  handleDeleteProfileTag: (tag: string) => void;
  selectedTag?: UserTags | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<UserTags | null>>;
  pubkyUser?: string;
  name?: string;
  uriImage?: string;
}

export default function ProfileTag({
  showModalProfileTag,
  setShowModalProfileTag,
  profileTags,
  handleAddProfileTag,
  handleDeleteProfileTag,
  selectedTag,
  setSelectedTag,
  pubkyUser,
  name,
  uriImage,
}: ProfileTagProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const modalProfileTagRef = useRef<HTMLDivElement>(null);
  const [tag, setTag] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [tagImages, setTagImages] = useState<{ [label: string]: string[] }>({});
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>(
    {}
  );
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setInitLoadingFollowers(true);

      const profilesMap: { [key: string]: UserView } = {};
      const followedMap: { [key: string]: boolean } = {};
      const taggers = selectedTag?.taggers || [];

      await Promise.all(
        taggers.map(async (user) => {
          try {
            const profile = await getUserProfile(user, pubky ?? '');
            profilesMap[user] = profile;

            if (profile.relationship?.following) {
              followedMap[user] = true;
            } else {
              followedMap[user] = false;
            }
          } catch (error) {
            console.error(`Error fetching profile for user ${user}`, error);
          }
        })
      );

      setUserProfiles(profilesMap);
      setFollowedUser((prevState) => ({ ...prevState, ...followedMap }));
      setInitLoadingFollowers(false);
    };

    fetchProfiles();
  }, [selectedTag, pubky]);

  const fetchProfileImages = async (tag: PostTag) => {
    const images = await Promise.all(
      tag.taggers.map(async (fromItem) => {
        const profile = await getUserProfile(fromItem, pubky ?? '');
        return profile?.details?.image || '/images/webp/Userpic.webp';
      })
    );
    return images;
  };

  // Fetch images for all tags
  useEffect(() => {
    const fetchAllImages = async () => {
      const imagesMap: { [label: string]: string[] } = {};
      await Promise.all(
        profileTags.map(async (tag) => {
          const images = await fetchProfileImages(tag);
          imagesMap[tag.label] = images.slice(0, 4);
        })
      );
      setTagImages(imagesMap);
    };

    if (profileTags.length > 0) {
      fetchAllImages();
    }
  }, [profileTags]);

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true,
      }));

      const result = await follow(pubkyFollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result,
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
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

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true,
      }));

      const result = await unfollow(pubkyUnfollow);

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result,
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalProfileTagRef.current &&
        !modalProfileTagRef.current.contains(event.target as Node)
      ) {
        setShowModalProfileTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalProfileTagRef, setShowModalProfileTag]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value
      .toLowerCase()
      .replace(/\s/g, '')
      .replace(/!/g, '');
    setTag(valueWithoutSpaces);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRefEmojis.current &&
        !wrapperRefEmojis.current.contains(event.target as Node)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRefEmojis]);

  return (
    <Modal.Root
      modalRef={modalProfileTagRef}
      show={showModalProfileTag}
      closeModal={() => {
        setShowModalProfileTag(false);
      }}
      className="md:w-[792px] max-h-[600px] overflow-y-auto"
    >
      <Modal.CloseAction
        id="close-btn"
        onClick={() => {
          setShowModalProfileTag(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <Modal.Header title={`Tag ${name}`} />
        <Modal.Content className="w-full flex flex-row">
          <div className="flex flex-col lg:flex-row gap-6">
            <div>
              {showEmojis && (
                <div
                  className="absolute translate-y-[10%] translate-x-[30%] z-10"
                  ref={wrapperRefEmojis}
                >
                  <EmojiPicker
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.TWITTER}
                    onEmojiClick={(emojiObject) => {
                      const emojiLength =
                        new Blob([emojiObject.emoji]).size / 2;

                      if (tag.length + emojiLength <= 20) {
                        setTag(tag + emojiObject.emoji);
                      }
                      setShowEmojis(false);
                    }}
                  />
                </div>
              )}
              <Input.Label value="New tag" />
              <Input.Text
                placeholder="tag"
                value={tag}
                className="w-full lg:w-96 mt-2 flex items-center"
                maxLength={20}
                autoFocus
                onChange={handleChange}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    handleAddProfileTag(tag);
                    setTag('');
                  }
                }}
                action={
                  <div className="flex gap-2">
                    <Button.Action
                      id="add-btn"
                      icon={<Icon.Plus size="18" />}
                      variant="custom"
                      size="medium"
                      className={tag ? 'flex' : 'hidden'}
                      onClick={() => {
                        handleAddProfileTag(tag);
                        setTag('');
                      }}
                    />
                    <Button.Action
                      variant="custom"
                      icon={<Icon.Smiley size="32" />}
                      size="medium"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowEmojis(true);
                      }}
                    />
                  </div>
                }
              />
              {name && uriImage && pubkyUser && (
                <SideCard.User
                  uri={pubkyUser}
                  className="mt-6"
                  uriImage={uriImage || '/images/webp/Userpic.webp'}
                  username={Utils.minifyText(name, 16)}
                  label={Utils.minifyPubky(pubkyUser)}
                />
              )}
            </div>
            <div className="justify-start items-start gap-2 flex flex-col overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-webkit">
              <Input.Label value={selectedTag ? 'Tagged' : 'Current tags'} />
              {profileTags.length > 0 ? (
                <>
                  {!selectedTag &&
                    profileTags.map((tag, index) => {
                      const isTagFound = tag?.taggers?.some(
                        (fromItem) => fromItem === pubky
                      );

                      const displayedImages = tagImages[tag.label] || [];
                      const extraImagesCount =
                        displayedImages.length > 4
                          ? displayedImages.length - 4
                          : 0;

                      return (
                        <div className="flex gap-2" key={index}>
                          <PostUtil.Tag
                            key={index}
                            clicked={isTagFound}
                            onClick={(event) => {
                              event.stopPropagation();
                              isTagFound
                                ? handleDeleteProfileTag(tag?.label)
                                : handleAddProfileTag(tag?.label);
                            }}
                            color={
                              tag?.label &&
                              Utils.generateRandomColor(tag?.label)
                            }
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(tag?.label, 21)}
                              <Typography.Caption
                                variant="bold"
                                className="text-opacity-60"
                              >
                                {tag?.taggers_count}
                              </Typography.Caption>
                            </div>
                          </PostUtil.Tag>

                          <Link href={`/search?tags=${tag?.label}`}>
                            <Button.Action
                              variant="custom"
                              size="small"
                              icon={<Icon.MagnifyingGlassLeft size="14" />}
                              className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                            />
                          </Link>
                          <div
                            onClick={() =>
                              setSelectedTag && setSelectedTag(tag)
                            }
                            className="cursor-pointer flex items-center"
                          >
                            {displayedImages.map((image, imageIndex) => (
                              <ImageByUri
                                width={32}
                                height={32}
                                key={imageIndex}
                                className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                                  imageIndex > 0 && '-ml-2'
                                }`}
                                alt={`tag-${imageIndex + 1}`}
                                uri={image}
                              />
                            ))}
                            {extraImagesCount > 0 && (
                              <>
                                <PostUtil.Counter className="-ml-2">
                                  +{extraImagesCount}
                                </PostUtil.Counter>
                              </>
                            )}
                            <Button.Action
                              variant="custom"
                              icon={<Icon.CaretRight size="16" />}
                              className="-ml-2"
                              size="small"
                            />
                          </div>
                        </div>
                      );
                    })}
                  {selectedTag && (
                    <>
                      <div className="flex gap-2 items-center mb-2">
                        <div
                          onClick={() => setSelectedTag && setSelectedTag(null)}
                          className="cursor-pointer"
                        >
                          <Button.Action
                            variant="custom"
                            icon={<Icon.CaretLeft size="16" />}
                            size="small"
                          />
                        </div>
                        {selectedTag && (
                          <PostUtil.Tag
                            clicked={selectedTag.taggers.some(
                              (fromItem) => fromItem === pubky
                            )}
                            onClick={(event) => {
                              event.stopPropagation();
                              selectedTag?.taggers.some(
                                (fromItem) => fromItem === pubky
                              )
                                ? handleDeleteProfileTag(selectedTag.label)
                                : handleAddProfileTag(selectedTag.label);
                            }}
                            color={
                              selectedTag.label &&
                              Utils.generateRandomColor(selectedTag.label)
                            }
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(
                                selectedTag.label.replace(' ', ''),
                                20
                              )}
                              <Typography.Caption
                                variant="bold"
                                className="text-opacity-60"
                              >
                                {selectedTag?.taggers_count}
                              </Typography.Caption>
                            </div>
                          </PostUtil.Tag>
                        )}
                        <Link href={`/search?tags=${selectedTag.label}`}>
                          <Button.Action
                            variant="custom"
                            size="small"
                            icon={<Icon.MagnifyingGlassLeft size="14" />}
                            className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                          />
                        </Link>
                      </div>
                      {selectedTag?.taggers?.map((user, userIndex) => {
                        const profile = userProfiles[user];
                        const pubkeyUser = pubky && user.includes(pubky);
                        const isFollowed = followedUser[user];

                        return (
                          <div
                            key={userIndex}
                            className="w-full flex justify-between gap-10"
                          >
                            <SideCard.User
                              uri={profile?.details?.id.replace('pubky:', '')}
                              uriImage={
                                profile?.details?.image ||
                                '/images/webp/Userpic.webp'
                              }
                              username={
                                profile?.details?.name &&
                                Utils.minifyText(profile?.details?.name)
                              }
                              label={Utils.minifyPubky(
                                profile?.details?.id.replace('pubky:', '')
                              )}
                            />
                            {pubkeyUser ? (
                              <SideCard.FollowAction
                                text="Me"
                                icon={<Icon.User size="16" />}
                                className="bg-transparent cursor-default"
                              />
                            ) : initLoadingFollowers ? (
                              <SideCard.FollowAction
                                disabled
                                icon={<Icon.LoadingSpin size="16" />}
                                variant="small"
                              />
                            ) : isFollowed ? (
                              <SideCard.FollowAction
                                onClick={
                                  loadingFollowers[user]
                                    ? undefined
                                    : () => unfollowUser(user)
                                }
                                disabled={loadingFollowers[user]}
                                loading={loadingFollowers[user]}
                                icon={<Icon.Minus size="16" />}
                                variant="small"
                              />
                            ) : (
                              <SideCard.FollowAction
                                onClick={
                                  loadingFollowers[user]
                                    ? undefined
                                    : () => followUser(user)
                                }
                                disabled={loadingFollowers[user]}
                                loading={loadingFollowers[user]}
                                icon={<Icon.Plus size="16" />}
                                variant="small"
                              />
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              ) : (
                <Typography.Body variant="small" className="text-opacity-50">
                  No tags yet
                </Typography.Body>
              )}
            </div>
          </div>
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
