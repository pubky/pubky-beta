'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Icon,
  Button,
  PostUtil,
  Input,
  Typography,
  SideCard,
} from '@social/ui-shared';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { Utils } from '@social/utils-shared';
import { usePubkyClientContext } from '@/contexts';
import { PostTag, PostView } from '@/types/Post';
import { getUserProfile } from '@/services/userService';
import { UserView } from '@/types/User';
import Link from 'next/link';
import { ImageByUri } from '@/components/ImageByUri';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  setShowModalTag: React.Dispatch<React.SetStateAction<boolean>>;
  tags: PostTag[];
  post: PostView;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  updatePostInTimeline: (updatedPost: PostView) => void;
  selectedTag?: PostTag | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<PostTag | null>>;
  tagsError?: boolean;
}

export default function ContentTag({
  setShowModalTag,
  tags,
  post,
  handleAddTag,
  handleDeleteTag,
  updatePostInTimeline,
  selectedTag,
  setSelectedTag,
  tagsError,
}: TagProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const [tag, setTag] = useState('');

  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [showEmojis, setShowEmojis] = useState(false);
  const [tagImages, setTagImages] = useState<{ [label: string]: string[] }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>(
    {},
  );
  const [loading, setLoading] = useState(false);
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
        }),
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
        try {
          const profile = await getUserProfile(fromItem, pubky ?? '');
          return profile?.details?.image || '/images/webp/Userpic.webp';
        } catch (error) {
          return '/images/webp/Userpic.webp';
        }
      }),
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
        }),
      );
      setTagImages(imagesMap);
    };

    if (tags.length > 0) {
      fetchAllImages();
    }
  }, [tags]);

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

  const handleAddTagAndUpdatePost = async (tag: string) => {
    try {
      setLoading(true);
      await handleAddTag(tag);
      const updatedTags = [
        ...post.tags,
        { label: tag, taggers: [pubky ?? ''], taggers_count: 1 },
      ];
      const updatedPost = { ...post, tags: updatedTags };
      updatePostInTimeline(updatedPost);
      setTag('');
      setLoading(false);
      //setShowModalTag(false);
    } catch (error) {
      console.error('Error adding tag and updating post', error);
    }
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
    <div className="flex flex-col md:flex-row gap-6">
      <div>
        {showEmojis && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-[9998]"
              onClick={() => setShowEmojis(false)}
            />
            <div
              id="emoji-picker"
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-white shadow-lg"
              ref={wrapperRefEmojis}
            >
              <EmojiPicker
                theme={Theme.DARK}
                emojiStyle={EmojiStyle.TWITTER}
                onEmojiClick={(emojiObject) => {
                  const emojiLength = new Blob([emojiObject.emoji]).size / 2;

                  if (tag.length + emojiLength <= 20) {
                    setTag(tag + emojiObject.emoji);
                  }
                  setShowEmojis(false);
                }}
              />
            </div>
          </>
        )}
        <Input.Label value="New tag" />
        <Input.Text
          placeholder="tag"
          value={tag}
          className="w-full md:w-96 mt-2 flex items-center"
          maxLength={20}
          autoFocus
          disabled={loading}
          onChange={handleChange}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleAddTagAndUpdatePost(tag);
            }
          }}
          action={
            <div className="flex">
              <Button.Action
                id="add-btn"
                icon={<Icon.Plus size="18" />}
                className={tag ? 'flex' : 'hidden'}
                variant="custom"
                size="medium"
                disabled={loading}
                onClick={() => {
                  handleAddTagAndUpdatePost(tag);
                }}
              />
              <Button.Action
                variant="custom"
                icon={<Icon.Smiley size="32" />}
                size="medium"
                className="hidden ml-2 lg:flex"
                disabled={loading}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowEmojis(true);
                }}
              />
            </div>
          }
        />
        {tagsError && (
          <Typography.Body variant="small" className="text-[#e95164] mt-4">
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
                  (fromItem) => fromItem === pubky,
                );

                const displayedImages = tagImages[tag.label] || [];
                const extraImagesCount =
                  displayedImages.length > 4 ? displayedImages.length - 4 : 0;

                return (
                  <div className="flex gap-2" key={index}>
                    <PostUtil.Tag
                      key={index}
                      clicked={isTagFound}
                      onClick={(event) => {
                        event.stopPropagation();
                        isTagFound
                          ? handleDeleteTag(tag?.label)
                          : handleAddTagAndUpdatePost(tag?.label);
                      }}
                      color={Utils.generateRandomColor(tag?.label)}
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
                      onClick={() => setSelectedTag && setSelectedTag(tag)}
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
                        (fromItem) => fromItem === pubky,
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectedTag?.taggers.some(
                          (fromItem) => fromItem === pubky,
                        )
                          ? handleDeleteTag(selectedTag?.label)
                          : handleAddTagAndUpdatePost(selectedTag?.label);
                      }}
                      color={
                        selectedTag?.label &&
                        Utils.generateRandomColor(selectedTag?.label)
                      }
                    >
                      <div className="flex gap-2 items-center">
                        {Utils.minifyText(selectedTag?.label, 21)}
                        <Typography.Caption
                          variant="bold"
                          className="text-opacity-60"
                        >
                          {selectedTag?.taggers_count}
                        </Typography.Caption>
                      </div>
                    </PostUtil.Tag>
                  )}
                  <Link href={`/search?tags=${selectedTag?.label}`}>
                    <Button.Action
                      variant="custom"
                      size="small"
                      icon={<Icon.MagnifyingGlassLeft size="14" />}
                      className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                    />
                  </Link>
                </div>
                {selectedTag?.taggers.map((user, userIndex) => {
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
                          profile?.details?.image || '/images/webp/Userpic.webp'
                        }
                        username={
                          profile?.details?.name &&
                          Utils.minifyText(profile?.details?.name)
                        }
                        label={Utils.minifyPubky(
                          profile?.details?.id.replace('pubky:', ''),
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
          <Typography.Body variant="small" className="text-opacity-30">
            No tags yet.
          </Typography.Body>
        )}
      </div>
    </div>
  );
}
