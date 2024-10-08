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
import { useRouter } from 'next/navigation';
import Post from '../Post';
import { ImageByUri } from '../ImageByUri';
import { usePubkyClientContext } from '@/contexts';
import { PostTag, PostView } from '@/types/Post';
import { getUserProfile } from '@/services/userService';
import { UseUserStreamFollowing } from '@/hooks/useUser';
import { UserView } from '@/types/User';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  tags: PostTag[];
  post: PostView;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  selectedTag?: PostTag | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<PostTag | null>>;
}

export default function Tag({
  showModalTag,
  setShowModalTag,
  tags,
  post,
  handleAddTag,
  handleDeleteTag,
  selectedTag,
  setSelectedTag,
}: TagProps) {
  const router = useRouter();
  const modalTagRef = useRef<HTMLDivElement>(null);
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const [tag, setTag] = useState('');
  const { data: initFollowing, isError } = UseUserStreamFollowing(
    post?.details?.author,
    pubky ?? ''
  );
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [tagsError, setTagsError] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [tagImages, setTagImages] = useState<{ [label: string]: string[] }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>(
    {}
  );
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesMap: { [key: string]: UserView } = {};
      const taggers = selectedTag?.taggers || [];

      await Promise.all(
        taggers.map(async (user) => {
          try {
            const profile = await getUserProfile(user, pubky ?? '');
            profilesMap[user] = profile;
          } catch (error) {
            console.error(`Error ${user}`, error);
          }
        })
      );
      setUserProfiles(profilesMap);
    };

    fetchProfiles();
  }, [selectedTag, pubky]);

  const fetchProfileImages = async (tag: PostTag) => {
    const images = await Promise.all(
      tag.taggers.map(async (fromItem) => {
        try {
          const profile = await getUserProfile(fromItem, pubky ?? '');
          return profile?.details?.image || '/images/Userpic.png';
        } catch (error) {
          return '/images/Userpic.png';
        }
      })
    );
    return images;
  };

  // Fetch images for all tags
  useEffect(() => {
    const fetchAllImages = async () => {
      const imagesMap: { [label: string]: string[] } = {};
      await Promise.all(
        tags.map(async (tag) => {
          const images = await fetchProfileImages(tag);
          imagesMap[tag.label] = images.slice(0, 4);
        })
      );
      setTagImages(imagesMap);
    };

    if (tags.length > 0) {
      fetchAllImages();
    }
  }, [tags]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        if (!pubky) return;

        if (isError) {
          setInitLoadingFollowers(false);
          return;
        }

        const following = initFollowing as UserView[];

        if (following && following.length > 0) {
          const followingIds = following?.map((user) =>
            user?.details?.id.replace('pubky:', '')
          );

          const matchedFollowedIds = tags
            .flatMap((tag) => tag?.taggers)
            .filter((profile) => followingIds.includes(profile));

          if (matchedFollowedIds.length > 0) {
            setInitLoadingFollowers(false);
            matchedFollowedIds.forEach((followed) => {
              setFollowedUser((prevState) => ({
                ...prevState,
                [followed]: true,
              }));
            });
          } else {
            setInitLoadingFollowers(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFollowing();
  }, [pubky, tags, initFollowing]);

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
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModalTag(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [modalTagRef, setShowModalTag]);

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
      modalRef={modalTagRef}
      show={showModalTag}
      closeModal={() => {
        setShowModalTag(false);
        setTag('');
        setTagsError(false);
      }}
      className="w-full w-[792px] max-h-[600px] overflow-y-auto"
    >
      <Modal.CloseAction
        id="close-btn"
        onClick={() => {
          setShowModalTag(false);
          setTag('');
          setTagsError(false);
        }}
      />
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <Modal.Header title="Tag Post" />
        <Modal.Content className="flex flex-row w-full">
          <div className="flex gap-6">
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
                      setTag(tag + emojiObject.emoji);
                      setShowEmojis(false);
                    }}
                  />
                </div>
              )}
              <Input.Label value="New tag" />
              <Input.Text
                placeholder="tag"
                value={tag}
                className="w-96 mt-2 flex items-center"
                maxLength={20}
                autoFocus
                onChange={handleChange}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    handleAddTag(tag);
                    setTag('');
                  }
                }}
                action={
                  <div className="flex gap-2">
                    <Button.Action
                      id="add-btn"
                      icon={<Icon.Plus size="18" />}
                      className={tag ? 'flex' : 'hidden'}
                      variant="custom"
                      size="medium"
                      onClick={() => {
                        handleAddTag(tag);
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
              {tagsError && (
                <Typography.Body
                  variant="small"
                  className="text-[#e95164] mt-4"
                >
                  Max 4 tags
                </Typography.Body>
              )}
            </div>
            <div
              id="current-tags"
              className="justify-start items-start gap-2 flex flex-col overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-webkit"
            >
              <Input.Label value={selectedTag ? 'Tagged' : 'Current tags'} />
              {tags.length > 0 ? (
                <>
                  {!selectedTag &&
                    tags.map((tag, index) => {
                      const isTagFound = tag?.taggers.some(
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
                                ? handleDeleteTag(tag?.label)
                                : handleAddTag(tag?.label);
                            }}
                            color={Utils.generateRandomColor(tag?.label)}
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(
                                tag?.label.replace(' ', ''),
                                20
                              )}
                              <Typography.Caption
                                variant="bold"
                                className="text-opacity-30"
                              >
                                {tag?.taggers_count}
                              </Typography.Caption>
                            </div>
                          </PostUtil.Tag>

                          <Button.Action
                            variant="custom"
                            size="small"
                            icon={<Icon.MagnifyingGlassLeft size="14" />}
                            onClick={() =>
                              router.push(`/search?tags=${tag?.label}`)
                            }
                            className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                          />
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
                                uri={String(image)}
                              />
                            ))}
                            {extraImagesCount > 0 && (
                              <PostUtil.Counter className="-ml-2">
                                +{extraImagesCount}
                              </PostUtil.Counter>
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
                            clicked={selectedTag?.taggers.some(
                              (fromItem) => fromItem === pubky
                            )}
                            onClick={(event) => {
                              event.stopPropagation();
                              selectedTag?.taggers.some(
                                (fromItem) => fromItem === pubky
                              )
                                ? handleDeleteTag(selectedTag?.label)
                                : handleAddTag(selectedTag?.label);
                            }}
                            color={
                              selectedTag?.label &&
                              Utils.generateRandomColor(selectedTag?.label)
                            }
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(
                                selectedTag?.label.replace(' ', ''),
                                20
                              )}
                              <Typography.Caption
                                variant="bold"
                                className="text-opacity-30"
                              >
                                {selectedTag?.taggers_count}
                              </Typography.Caption>
                            </div>
                          </PostUtil.Tag>
                        )}
                        <Button.Action
                          variant="custom"
                          size="small"
                          icon={<Icon.MagnifyingGlassLeft size="14" />}
                          onClick={() =>
                            router.push(`/search?tags=${selectedTag?.label}`)
                          }
                          className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                        />
                      </div>
                      {selectedTag?.taggers.map((user, userIndex) => {
                        const profile = userProfiles[user];
                        const pubkeyUser = pubky && user.includes(pubky);
                        const isFollowed = followedUser[user] || false;

                        return (
                          <div
                            key={userIndex}
                            className="w-full flex justify-between gap-10"
                          >
                            <SideCard.User
                              uri={profile?.details?.id.replace('pubky:', '')}
                              uriImage={
                                profile?.details?.image || '/images/Userpic.png'
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
                                icon={<Icon.Check />}
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
                <Typography.Body variant="small" className="text-opacity-30">
                  Not tags yet.
                </Typography.Body>
              )}
            </div>
          </div>
        </Modal.Content>
        {post && (
          <div>
            <Post post={post} repostView />
          </div>
        )}
      </div>
    </Modal.Root>
  );
}
