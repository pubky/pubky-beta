'use client';

import {
  BottomSheet,
  Button,
  Icon,
  Input,
  PostUtil,
  SideCard,
  Typography,
} from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ImageByUri } from '../ImageByUri';
import Post from '../Post';
import { PostTag, PostView } from '@/types/Post';
import { UserView } from '@/types/User';
import { usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';

interface TagProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
  tags: PostTag[];
  post: PostView;
  handleAddTag: (tag: string) => Promise<void>;
  handleDeleteTag: (tag: string) => Promise<void>;
  updatePostInTimeline: (updatedPost: PostView) => void;
  selectedTag?: PostTag | null;
  setSelectedTag?: React.Dispatch<React.SetStateAction<PostTag | null>>;
}

export default function Tag({
  show,
  setShow,
  title,
  className,
  tags,
  post,
  handleAddTag,
  handleDeleteTag,
  updatePostInTimeline,
  selectedTag,
  setSelectedTag,
}: TagProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const [tag, setTag] = useState('');

  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [tagImages, setTagImages] = useState<{ [label: string]: string[] }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>(
    {},
  );
  const [loading, setLoading] = useState(false);

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

  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Tag Post'}
      className={className}
    >
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div>
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
                <div className="flex gap-2">
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
                </div>
              }
            />
            {/**tagsError && (
              <Typography.Body variant="small" className="text-[#e95164] mt-4">
                Max 4 tags
              </Typography.Body>
            )*/}
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
                              profile?.details?.image ||
                              '/images/webp/Userpic.webp'
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
        {post && (
          <div>
            <Post post={post} repostView />
          </div>
        )}
      </div>
    </BottomSheet.Root>
  );
}
