'use client';

import { ContentNotFound, Skeleton } from '@/components';
import { useUserProfile } from '@/hooks/useUser';
import { useModal, usePubkyClientContext } from '@/contexts';
import { UserTags } from '@/types/User';
import { Button, Icon, PostUtil, SideCard, Typography, Input } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { ImageByUri } from '@/components/ImageByUri';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import LinksSection from './Sidebar/_LinksSection';
import Image from 'next/image';
import { useUtilsTag } from '@/app/profile/components/_UtilsTags';
import { useTagsUser } from '@/hooks/useTag';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useUserTagTaggers } from '@/hooks/useUser';
import { getUserProfile } from '@/services/userService';
import { useAlertContext } from '@/contexts';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import EmojiPicker from '@/components/EmojiPicker';

type TaggedAsProps = {
  creatorPubky?: string | undefined;
  loading?: boolean;
};

export default function TaggedAs({ creatorPubky, loading }: TaggedAsProps) {
  const { openModal } = useModal();
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const isMyProfile = !!(pubky === creatorPubky || !creatorPubky);
  const usePubky = creatorPubky || pubky;
  const { data: user } = useUserProfile(usePubky ?? '', pubky ?? '');
  const name = user?.details?.name;
  const [profileTags, setProfileTags] = useState<UserTags[]>();
  const links = user?.details?.links ?? [];
  const limit = 5;
  const [skip, setSkip] = useState(limit);
  const [hasMore, setHasMore] = useState(user && user?.counts?.tags > limit);
  const [selectedTag, setSelectedTag] = useState<UserTags | null>(null);
  const [taggers, setTaggers] = useState<string[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: any }>({});
  const [followedUser, setFollowedUser] = useState<{ [key: string]: boolean }>({});
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{ [key: string]: boolean }>({});
  const limitTaggers = 5;
  const [skipTaggers, setSkipTaggers] = useState(limitTaggers);
  const [hasMoreTaggers, setHasMoreTaggers] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [loadingTag, setLoadingTag] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  const { addProfileTag, deleteProfileTag, loadingTags } = useUtilsTag({
    profileTags,
    setProfileTags,
    pubkyUser: usePubky,
    user
  });

  const { data: moreTags, isLoading } = useTagsUser(usePubky ?? '', pubky ?? '', skip, limit);

  const { data: moreTaggers, isLoading: isLoadingTaggers } = useUserTagTaggers(
    user?.details.id ?? '',
    selectedTag?.label ?? '',
    pubky ?? '',
    skipTaggers,
    limitTaggers
  );

  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  useEffect(() => {
    setProfileTags(user?.tags);
  }, [user?.tags]);

  useEffect(() => {
    if (!isLoading && moreTags && moreTags.length) {
      if (!user?.tags) {
        setProfileTags((prev) => {
          const newTags = moreTags.filter((tag) => {
            if (!prev) return true;
            return !prev.some((t) => t.label === tag.label);
          });
          setHasMore(newTags.length > 0);
          return [...(prev ?? []), ...newTags];
        });
      }
    }
  }, [moreTags, isLoading, user?.tags]);

  useEffect(() => {
    if (moreTaggers && moreTaggers.users) {
      const { users } = moreTaggers;
      setTaggers((prev) => [...new Set([...prev, ...users])]);
      setHasMoreTaggers(users.length === limitTaggers);
    } else {
      setHasMoreTaggers(false);
    }
  }, [moreTaggers]);

  useEffect(() => {
    if (selectedTag) {
      const initialTaggers = selectedTag.taggers.slice(0, limitTaggers);
      setTaggers(initialTaggers);
      setSkipTaggers(limitTaggers);
      setHasMoreTaggers(selectedTag.taggers_count > limitTaggers);
    } else {
      setTaggers([]);
      setSkipTaggers(limitTaggers);
      setHasMoreTaggers(false);
    }
  }, [selectedTag]);

  useEffect(() => {
    if (taggers.length === 0) return;

    const fetchProfiles = async () => {
      setInitLoadingFollowers(true);
      const profilesMap: { [key: string]: any } = {};
      const followedMap: { [key: string]: boolean } = {};

      await Promise.all(
        taggers.map(async (userId) => {
          if (userProfiles[userId]) return;
          try {
            const profile = await getUserProfile(userId, pubky ?? '');
            profilesMap[userId] = profile;
            followedMap[userId] = profile.relationship?.following ?? false;
          } catch (error) {
            console.error(`Error fetching profile for user ${userId}`, error);
          }
        })
      );

      setUserProfiles((prev) => ({ ...prev, ...profilesMap }));
      setFollowedUser((prev) => ({ ...prev, ...followedMap }));
      setInitLoadingFollowers(false);
    };

    fetchProfiles();
  }, [taggers, pubky]);

  const loader = useInfiniteScroll(() => {
    if (hasMore && !isLoading) {
      setSkip((prev) => prev + limit);
    }
  }, isLoading);

  const loaderTaggers = useInfiniteScroll(() => {
    if (hasMoreTaggers && !isLoadingTaggers) {
      setSkipTaggers((prev) => prev + limitTaggers);
    }
  }, isLoadingTaggers);

  const handleFollowUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true
      }));

      const result = await follow(pubkyFollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollowUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: true
      }));

      const result = await unfollow(pubkyFollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyFollow]: result
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyFollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTag = async (tag: string) => {
    if (!tag || !pubky) return;

    setLoadingTag(true);
    try {
      await addProfileTag(tag);
      setTagInput('');
    } catch (error) {
      console.error('Error adding tag:', error);
      addAlert('Failed to add tag', 'warning');
    } finally {
      setLoadingTag(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white/10 rounded-lg">
      {name && profileTags?.length > 0 && (
        <Typography.Body variant="medium-bold">{name} was tagged as:</Typography.Body>
      )}
      {loading ? (
        <Skeleton.Simple />
      ) : (
        <>
          <div className="mt-4 justify-start items-start gap-2 flex flex-col">
            <div className="mb-4 relative">
              {showEmojis && (
                <div className="absolute translate-y-[10%] translate-x-[30%] z-10" ref={wrapperRefEmojis}>
                  <EmojiPicker
                    onEmojiSelect={(emojiObject) => {
                      setTagInput(tagInput + emojiObject.native);
                      setShowEmojis(false);
                    }}
                    maxLength={20}
                    currentInput={tagInput}
                  />
                </div>
              )}
              <Input.Tag
                value={tagInput}
                onChange={setTagInput}
                onAddTag={handleAddTag}
                onEmojiPickerClick={() => setShowEmojis(true)}
                loading={loadingTag}
                variant="small"
              />
            </div>
            {profileTags && profileTags.length > 0 ? (
              <>
                {!selectedTag ? (
                  <>
                    {profileTags.map((tag, index) => {
                      const isTagFound = tag?.relationship || false;
                      const displayedImages = tag.taggers?.slice(0, 5);
                      const extraImagesCount = tag.taggers_count - displayedImages?.length;

                      return (
                        <div className="flex gap-2" key={index}>
                          <PostUtil.Tag
                            clicked={isTagFound}
                            onClick={(event) => {
                              event.stopPropagation();
                              pubky
                                ? isTagFound
                                  ? deleteProfileTag(tag?.label)
                                  : addProfileTag(tag?.label)
                                : openModal('join');
                            }}
                            color={tag?.label && Utils.generateRandomColor(tag?.label)}
                          >
                            <div className="flex gap-2 items-center">
                              {Utils.minifyText(tag?.label, 20)}
                              {loadingTags === tag?.label ? (
                                <Icon.LoadingSpin size="12" />
                              ) : (
                                <Typography.Caption variant="bold" className="text-opacity-60">
                                  {tag.taggers_count}
                                </Typography.Caption>
                              )}
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
                          <div onClick={() => setSelectedTag(tag)} className="cursor-pointer flex items-center">
                            {displayedImages?.map((image, imageIndex) => (
                              <ImageByUri
                                id={image}
                                width={32}
                                height={32}
                                key={`${tag?.label}-${imageIndex}`}
                                className={`w-[32px] h-[32px] rounded-full shadow justify-center items-center flex ${
                                  imageIndex > 0 && '-ml-2'
                                }`}
                                alt={`tag-${imageIndex + 1}`}
                              />
                            ))}
                            {extraImagesCount > 0 && (
                              <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>
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
                    {hasMore && <div ref={loader} />}
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 items-center mb-2">
                      <div onClick={() => setSelectedTag(null)} className="cursor-pointer">
                        <Button.Action variant="custom" icon={<Icon.CaretLeft size="16" />} size="small" />
                      </div>
                      <PostUtil.Tag
                        clicked={selectedTag.relationship || false}
                        onClick={(event) => {
                          event.stopPropagation();
                          selectedTag?.taggers.some((fromItem) => fromItem === pubky)
                            ? deleteProfileTag(selectedTag.label)
                            : addProfileTag(selectedTag.label);
                        }}
                        color={selectedTag.label && Utils.generateRandomColor(selectedTag.label)}
                      >
                        <div className="flex gap-2 items-center">
                          {Utils.minifyText(selectedTag.label.replace(' ', ''), 20)}
                          {loadingTags === selectedTag?.label ? (
                            <Icon.LoadingSpin size="12" />
                          ) : (
                            <Typography.Caption variant="bold" className="text-opacity-60">
                              {selectedTag?.taggers_count}
                            </Typography.Caption>
                          )}
                        </div>
                      </PostUtil.Tag>
                      <Link href={`/search?tags=${selectedTag.label}`}>
                        <Button.Action
                          variant="custom"
                          size="small"
                          icon={<Icon.MagnifyingGlassLeft size="14" />}
                          className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
                        />
                      </Link>
                    </div>
                    {taggers?.map((user, userIndex) => {
                      const profile = userProfiles[user];
                      const pubkeyUser = pubky && user.includes(pubky);
                      const isFollowed = followedUser[user];

                      return (
                        <div key={userIndex} className="w-full flex justify-between gap-10">
                          <SideCard.User
                            uri={profile?.details?.id.replace('pubky:', '')}
                            username={profile?.details?.name && Utils.minifyText(profile?.details?.name)}
                            label={Utils.minifyPubky(profile?.details?.id.replace('pubky:', ''))}
                          />
                          {pubkeyUser ? (
                            <SideCard.FollowAction
                              text="Me"
                              icon={<Icon.User size="16" />}
                              className="bg-transparent cursor-default"
                            />
                          ) : initLoadingFollowers ? (
                            <SideCard.FollowAction disabled icon={<Icon.LoadingSpin size="16" />} variant="small" />
                          ) : isFollowed ? (
                            <SideCard.FollowAction
                              onClick={loadingFollowers[user] ? undefined : () => handleUnfollowUser(user)}
                              disabled={loadingFollowers[user]}
                              loading={loadingFollowers[user]}
                              icon={<Icon.Minus size="16" />}
                              variant="small"
                            />
                          ) : (
                            <SideCard.FollowAction
                              onClick={loadingFollowers[user] ? undefined : () => handleFollowUser(user)}
                              disabled={loadingFollowers[user]}
                              loading={loadingFollowers[user]}
                              icon={<Icon.Plus size="16" />}
                              variant="small"
                            />
                          )}
                        </div>
                      );
                    })}
                    {hasMoreTaggers && (
                      <div ref={loaderTaggers}>
                        <Icon.LoadingSpin />
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <ContentNotFound
                icon={<Icon.Tag size="48" color="#C8FF00" />}
                title={isMyProfile ? 'Discover who tagged you' : 'No tags yet'}
                description={
                  isMyProfile ? (
                    <>
                      Find out which posts, photos, or content include tags mentioning you.
                      <br />
                      Stay connected to what others are sharing about you.
                    </>
                  ) : (
                    'There are no tags to show.'
                  )
                }
              >
                <div className="absolute top-12 z-0">
                  <Image alt="not-found-taggedAs" width={461} height={303} src="/images/webp/not-found/taggedAs.webp" />
                </div>
              </ContentNotFound>
            )}
          </div>
          <div className="flex lg:hidden mt-6">
            <LinksSection links={links} />
          </div>
        </>
      )}
    </div>
  );
}
