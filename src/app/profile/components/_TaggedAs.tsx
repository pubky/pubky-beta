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
import { useSuggestedTags } from '@/hooks/useSuggestedTags';

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
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
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
  const bgCard = profileTags?.length > 0 && 'bg-white/10';

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

  const { suggestedTags, selectedTagIndex, handleKeyDown, handleTagClick } = useSuggestedTags({
    tagInput,
    onTagSelect: (tag) => setTagInput(tag)
  });

  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  useEffect(() => {
    setProfileTags(user?.tags);
    setSkip(0);
    setHasMore(true);
  }, [user?.tags]);

  useEffect(() => {
    if (!isLoading && moreTags) {
      setProfileTags((prev) => {
        if (!prev) return moreTags;

        // Create a Map to track unique tags by label
        const uniqueTags = new Map();

        // First add all existing tags
        prev.forEach((tag) => {
          uniqueTags.set(tag.label, tag);
        });

        // Then add new tags, overwriting existing ones if they have more taggers
        moreTags.forEach((tag) => {
          const existingTag = uniqueTags.get(tag.label);
          if (!existingTag || tag.taggers_count > existingTag.taggers_count) {
            uniqueTags.set(tag.label, tag);
          }
        });

        // Convert Map back to array and maintain order
        const updatedTags = Array.from(uniqueTags.values());

        // Set hasMore based on whether we received any new tags
        setHasMore(moreTags.length > 0);
        setIsLoadingMore(false);

        return updatedTags;
      });
    } else if (!isLoading && !moreTags) {
      setHasMore(false);
      setIsLoadingMore(false);
    }
  }, [moreTags, isLoading]);

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
    if (hasMore && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      setSkip((prev) => prev + limit);
    }
  }, isLoading || isLoadingMore);

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

  const handleAddTagWithCheck = async (tag: string) => {
    if (!tag || !pubky) return;

    setLoadingTag(true);
    try {
      if (selectedTagIndex > -1) {
        const selectedTag = suggestedTags[selectedTagIndex];
        setTagInput(selectedTag);
      } else {
        await addProfileTag(tag);
        setTagInput('');
      }
    } catch (error) {
      console.error('Error adding tag:', error);
      addAlert('Failed to add tag', 'warning');
    } finally {
      setLoadingTag(false);
    }
  };

  return (
    <div className={`${bgCard} w-full p-6 rounded-lg`}>
      {name && profileTags?.length > 0 && (
        <Typography.Body variant="medium-bold">
          {name} {profileTags?.length > 0 ? 'was tagged as' : 'was not tagged yet'}:
        </Typography.Body>
      )}
      {loading ? (
        <Skeleton.Simple />
      ) : (
        <>
          <div className="mt-3 justify-start items-start gap-2 flex flex-col">
            {profileTags && profileTags.length > 0 ? (
              <>
                <div className="relative">
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
                  <div className="relative" onKeyDown={handleKeyDown} tabIndex={0}>
                    <Input.Tag
                      value={tagInput}
                      onChange={setTagInput}
                      onAddTag={handleAddTagWithCheck}
                      onEmojiPickerClick={() => setShowEmojis(true)}
                      loading={loadingTag}
                      className="w-fit"
                      variant="small"
                      autoComplete={false}
                    />
                    {suggestedTags.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 bg-[#05050A] border border-white border-opacity-20 rounded-lg z-20 w-[200px] max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-webkit">
                        {suggestedTags.map((tag, index) => (
                          <div
                            key={index}
                            onClick={() => handleTagClick(tag)}
                            className={`cursor-pointer hover:bg-white hover:bg-opacity-10 rounded px-4 py-2 ${
                              index === selectedTagIndex ? 'bg-white bg-opacity-10' : ''
                            }`}
                          >
                            <Typography.Body variant="small" className="text-opacity-80 hover:text-opacity-100">
                              {tag}
                            </Typography.Body>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {!selectedTag ? (
                  <div className="w-full flex flex-col gap-2 pr-2 pb-2 overflow-y-auto scrollbar-thin scrollbar-webkit">
                    {profileTags.map((tag, index) => {
                      const isTagFound = tag?.relationship || false;
                      const displayedImages = tag.taggers?.slice(0, 5);
                      const extraImagesCount = tag.taggers_count - displayedImages?.length;

                      return (
                        <div className="flex gap-2" key={index}>
                          <PostUtil.Tag
                            id={`tag-${tag?.label}`}
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
                              <div
                                key={`${tag?.label}-${imageIndex}`}
                                className={`w-[32px] h-[32px] ${imageIndex > 0 && '-ml-2'}`}
                              >
                                <ImageByUri
                                  id={image}
                                  width={32}
                                  height={32}
                                  className="w-[32px] h-[32px] rounded-full shadow justify-center items-center flex"
                                  alt={`tag-${imageIndex + 1}`}
                                />
                              </div>
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
                    {hasMore && (
                      <div ref={loader} className="flex justify-center">
                        <Icon.LoadingSpin size="24" />
                      </div>
                    )}
                  </div>
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
                    <div className="max-h-[300px] flex flex-col gap-2 pr-2 overflow-y-auto scrollbar-thin scrollbar-webkit">
                      {taggers?.map((user, userIndex) => {
                        const profile = userProfiles[user];
                        const pubkeyUser = pubky && user.includes(pubky);
                        const isFollowed = followedUser[user];

                        return (
                          <div key={userIndex} className="w-full max-w-[250px] flex justify-between gap-10">
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
                    </div>
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
                      No one has tagged you yet.
                      <br />
                      Tip: You can add tags to your own profile too.
                    </>
                  ) : (
                    'There are no tags to show.'
                  )
                }
              >
                <div className="z-10 relative">
                  {showEmojis && (
                    <div className="absolute translate-y-[10%] translate-x-[30%] z-20" ref={wrapperRefEmojis}>
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
                  <div className="relative" onKeyDown={handleKeyDown} tabIndex={0}>
                    <Input.Tag
                      value={tagInput}
                      onChange={setTagInput}
                      onAddTag={handleAddTagWithCheck}
                      onEmojiPickerClick={() => setShowEmojis(true)}
                      loading={loadingTag}
                      className="w-fit"
                      variant="small"
                      autoComplete={false}
                    />
                    {suggestedTags.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 bg-[#05050A] border border-white border-opacity-20 rounded-lg z-20 w-[200px] max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-webkit">
                        {suggestedTags.map((tag, index) => (
                          <div
                            key={index}
                            onClick={() => handleTagClick(tag)}
                            className={`cursor-pointer hover:bg-white hover:bg-opacity-10 rounded px-4 py-2 ${
                              index === selectedTagIndex ? 'bg-white bg-opacity-10' : ''
                            }`}
                          >
                            <Typography.Body variant="small" className="text-opacity-80 hover:text-opacity-100">
                              {tag}
                            </Typography.Body>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
