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
import { useClientContext } from '@/contexts';
import { IPost, ITaggedPost } from '@/types';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { Utils } from '@social/utils-shared';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Post from '../Post';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModalTag: boolean;
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  tags: ITaggedPost[];
  post: IPost;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  selectedTag?: ITaggedPost | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<ITaggedPost | null>>;
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
  const { pubky, follow, unfollow, listFollowing } = useClientContext();
  const [tag, setTag] = useState('');
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [tagsError, setTagsError] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        if (!pubky) return;

        const following = await listFollowing(pubky);

        if (following) {
          const followingIds = following.following.map((user) =>
            user.uri.replace('pubky:', '')
          );

          const matchedFollowedIds = tags
            .flatMap((tag) => tag.from)
            .filter((profile) => followingIds.includes(profile.author.id));

          if (matchedFollowedIds.length > 0) {
            setInitLoadingFollowers(false);
            matchedFollowedIds.forEach((followed) => {
              setFollowedUser((prevState) => ({
                ...prevState,
                [followed.author.id]: true,
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
  }, [pubky, listFollowing, tags]);

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
    const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
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
      className="w-full w-[792px]"
    >
      <Modal.CloseAction
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
              {post && <Post className="mt-4" post={post} repostView />}
            </div>
            <div className="justify-start items-start gap-2 flex flex-col overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-webkit">
              {tags.length > 0 ? (
                <>
                  {!selectedTag &&
                    tags.map((tag, index) => {
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
                          <PostUtil.Tag
                            key={index}
                            clicked={isTagFound}
                            onClick={(event) => {
                              event.stopPropagation();
                              isTagFound
                                ? handleDeleteTag(tag.tag)
                                : handleAddTag(tag.tag);
                            }}
                            color="fuchsia"
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
                            onClick={() =>
                              setSelectedTag && setSelectedTag(tag)
                            }
                            className="cursor-pointer flex items-center"
                          >
                            {displayedImages.map((image, imageIndex) => (
                              <Image
                                width={32}
                                height={32}
                                key={imageIndex}
                                className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                                  imageIndex > 0 && '-ml-2'
                                }`}
                                alt={`tag-${imageIndex + 1}`}
                                src={image}
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
                          <Icon.ArrowLeft size="16" />
                        </div>
                        {selectedTag && (
                          <PostUtil.Tag
                            clicked={selectedTag.from.some(
                              (fromItem) => fromItem.author.id === pubky
                            )}
                            onClick={(event) => {
                              event.stopPropagation();
                              selectedTag.from.some(
                                (fromItem) => fromItem.author.id === pubky
                              )
                                ? handleDeleteTag(selectedTag.tag)
                                : handleAddTag(selectedTag.tag);
                            }}
                            color="fuchsia"
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(
                                selectedTag.tag.replace(' ', ''),
                                20
                              )}
                              <Typography.Caption
                                variant="bold"
                                className="text-opacity-30"
                              >
                                {selectedTag.count}
                              </Typography.Caption>
                            </div>
                          </PostUtil.Tag>
                        )}
                      </div>
                      {selectedTag.from.map((user, userIndex) => {
                        const pubkeyUser =
                          pubky && user?.author?.id.includes(pubky);
                        const isFollowed =
                          followedUser[user?.author?.id] || false;
                        return (
                          <div
                            key={userIndex}
                            className="w-full flex justify-between gap-10"
                          >
                            <SideCard.User
                              uri={user?.author?.uri.replace('pubky:', '')}
                              src={
                                user?.author?.profile?.image ||
                                '/images/Userpic.png'
                              }
                              username={
                                user?.author?.profile?.name &&
                                Utils.minifyText(user?.author?.profile?.name)
                              }
                              label={Utils.minifyPubky(
                                user.author.uri.replace('pubky:', '')
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
                                  loadingFollowers[user?.author?.id]
                                    ? undefined
                                    : () => unfollowUser(user?.author?.id)
                                }
                                disabled={loadingFollowers[user?.author?.id]}
                                loading={loadingFollowers[user?.author?.id]}
                                icon={<Icon.Minus size="16" />}
                                variant="small"
                              />
                            ) : (
                              <SideCard.FollowAction
                                onClick={
                                  loadingFollowers[user?.author?.id]
                                    ? undefined
                                    : () => followUser(user?.author?.id)
                                }
                                disabled={loadingFollowers[user?.author?.id]}
                                loading={loadingFollowers[user?.author?.id]}
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
      </div>
    </Modal.Root>
  );
}
