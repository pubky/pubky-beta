'use client';

import { usePubkyClientContext } from '@/contexts';
import { PostType, PostView, PostTag } from '@/types/Post';
import { Button, Icon, Input, PostUtil, SideCard, Typography } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { useState, useRef, useEffect } from 'react';
import { useTagsLogic } from './TagsUtils';
import { useTagsPost } from '@/hooks/useTag';
import { usePostTagTaggers } from '@/hooks/useUser';
import { ImageByUri } from '@/components/ImageByUri';
import Link from 'next/link';
import { getUserProfile } from '@/services/userService';
import { UserView } from '@/types/User';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import EmojiPicker from '@/components/EmojiPicker';
import { useSuggestedTags } from '@/hooks/useSuggestedTags';

interface ShowAllTagsProps {
  post: PostView;
  postType: PostType;
  onTagClick?: (tag: PostTag) => void;
}

const TAG_LIMIT = 5;
const TAGGER_LIMIT = 5;

export default function ShowAllTags({ post, postType, onTagClick }: ShowAllTagsProps) {
  const { tags, loadingTags, handleAddTag, handleDeleteTag, openModal } = useTagsLogic(post, postType);
  const { pubky, follow, unfollow } = usePubkyClientContext();

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [loadingTag, setLoadingTag] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));
  useDrawerClickOutside(inputWrapperRef, () => {
    // Hide suggested tags when clicking outside
    if (suggestedTagsFromHook.length > 0) {
      setSuggestedTagsFromHook([]);
      setSelectedTagIndex(-1);
    }
  });

  // Infinite scroll state
  const [skip, setSkip] = useState(TAG_LIMIT);
  const [hasMore, setHasMore] = useState(post.counts?.tags > TAG_LIMIT);
  const [allTags, setAllTags] = useState<typeof tags>([]);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Taggers state
  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{ [pubky: string]: boolean }>({});
  const [followedUser, setFollowedUser] = useState<{ [pubky: string]: boolean }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>({});
  const [skipTaggers, setSkipTaggers] = useState(TAGGER_LIMIT);
  const [taggers, setTaggers] = useState<string[]>([]);
  const [hasMoreTaggers, setHasMoreTaggers] = useState(false);
  const loaderTaggersRef = useRef<HTMLDivElement>(null);

  // API hooks
  const { data: moreTags, isLoading } = useTagsPost(post?.details?.author, post?.details?.id, pubky, skip, TAG_LIMIT);
  const { data: moreTaggers, isLoading: isLoadingTaggers } = usePostTagTaggers(
    post?.details?.author,
    post?.details?.id,
    selectedTag?.label ?? '',
    pubky,
    skipTaggers,
    TAGGER_LIMIT
  );

  const {
    suggestedTags: suggestedTagsFromHook,
    selectedTagIndex,
    handleKeyDown,
    handleTagClick: handleSuggestedTagClick,
    setSuggestedTags: setSuggestedTagsFromHook,
    setSelectedTagIndex
  } = useSuggestedTags({
    tagInput,
    onTagSelect: (tag) => setTagInput(tag)
  });

  // Effects for tag management
  useEffect(() => {
    setSkip(TAG_LIMIT);
    setHasMore(post?.counts?.tags > TAG_LIMIT);
    setAllTags([...tags].sort((a, b) => (b.taggers_count || 0) - (a.taggers_count || 0)));
  }, [post?.details?.id]);

  useEffect(() => {
    setAllTags((prev) => {
      const newTags = tags.filter((tag) => !prev.some((t) => t.label === tag.label));
      return [...newTags, ...prev];
    });
  }, [tags]);

  useEffect(() => {
    if (!isLoading && moreTags) {
      setAllTags((prev) => {
        const updatedTags = [...prev, ...moreTags];
        const uniqueTags = updatedTags.filter(
          (tag, index, self) => index === self.findIndex((t) => t.label === tag.label)
        );
        return uniqueTags.sort((a, b) => (b.taggers_count || 0) - (a.taggers_count || 0));
      });
      setHasMore(moreTags.length === TAG_LIMIT);
    } else if (!isLoading && !moreTags) {
      setHasMore(false);
    }
  }, [moreTags, isLoading]);

  // Effects for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          setSkip((prev) => prev + TAG_LIMIT);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current && hasMore) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreTaggers && !isLoadingTaggers) {
          setSkipTaggers((prev) => prev + TAGGER_LIMIT);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderTaggersRef.current && hasMoreTaggers) {
      observer.observe(loaderTaggersRef.current);
    }

    return () => {
      if (loaderTaggersRef.current) {
        observer.unobserve(loaderTaggersRef.current);
      }
    };
  }, [hasMoreTaggers, isLoadingTaggers]);

  // Effects for taggers management
  useEffect(() => {
    if (selectedTag) {
      const initialTaggers = selectedTag.taggers.slice(0, TAGGER_LIMIT);
      setTaggers(initialTaggers);
      setSkipTaggers(TAGGER_LIMIT);
      setHasMoreTaggers(selectedTag.taggers_count > TAGGER_LIMIT);
    } else {
      setTaggers([]);
      setSkipTaggers(TAGGER_LIMIT);
      setHasMoreTaggers(false);
    }
  }, [selectedTag]);

  useEffect(() => {
    if (moreTaggers && moreTaggers.users) {
      const { users } = moreTaggers;
      setTaggers((prev) => [...new Set([...prev, ...users])]);
      setHasMoreTaggers(users.length === TAGGER_LIMIT);
    }
  }, [moreTaggers]);

  useEffect(() => {
    if (taggers.length === 0) return;

    const fetchProfiles = async () => {
      setInitLoadingFollowers(true);
      const profilesMap: { [key: string]: UserView } = {};
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

  // Event handlers
  const handleAddTagInput = async (tag: string) => {
    if (!tag.trim()) return;
    setLoadingTag(true);
    try {
      if (selectedTagIndex > -1) {
        const selectedTag = suggestedTagsFromHook[selectedTagIndex];
        setTagInput(selectedTag);
      } else {
        const optimisticTag: PostTag = {
          label: tag,
          taggers_count: 1,
          taggers: [pubky ?? ''],
          relationship: true
        };

        setAllTags((prev) => [optimisticTag, ...prev]);
        await handleAddTag(tag);
        setTagInput('');
        setSkip(TAG_LIMIT);
        setHasMore(true);
      }
    } catch (error) {
      setAllTags((prev) => prev.filter((t) => t.label !== tag));
      console.error('Error adding tag', error);
    } finally {
      setLoadingTag(false);
    }
  };

  const handleTagClick = async (tag: PostTag) => {
    if (!pubky) {
      openModal('join');
      return;
    }

    try {
      setAllTags((prev) =>
        prev.map((t) =>
          t.label === tag.label
            ? {
                ...t,
                relationship: !t.relationship,
                taggers_count: t.relationship ? t.taggers_count - 1 : t.taggers_count + 1,
                taggers: t.relationship ? t.taggers.filter((tagger) => tagger !== pubky) : [...t.taggers, pubky ?? '']
              }
            : t
        )
      );

      if (tag.relationship) {
        await handleDeleteTag(tag.label);
      } else {
        await handleAddTag(tag.label);
      }
    } catch (error) {
      setAllTags((prev) =>
        prev.map((t) =>
          t.label === tag.label
            ? {
                ...t,
                relationship: t.relationship,
                taggers_count: t.relationship ? t.taggers_count + 1 : t.taggers_count - 1,
                taggers: t.relationship ? [...t.taggers, pubky ?? ''] : t.taggers.filter((tagger) => tagger !== pubky)
              }
            : t
        )
      );
      console.error('Error handling tag click:', error);
    }
  };

  const followUser = async (pubkyFollow: string) => {
    try {
      if (!pubkyFollow) return;

      setLoadingFollowers((prev) => ({ ...prev, [pubkyFollow]: true }));
      const result = await follow(pubkyFollow);

      if (!result) {
        console.error('Something went wrong!');
      }

      setFollowedUser((prev) => ({ ...prev, [pubkyFollow]: result }));
      setLoadingFollowers((prev) => ({ ...prev, [pubkyFollow]: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;

      setLoadingFollowers((prev) => ({ ...prev, [pubkyUnfollow]: true }));
      const result = await unfollow(pubkyUnfollow);

      if (!result) {
        console.error('Something went wrong!');
      }

      setFollowedUser((prev) => ({ ...prev, [pubkyUnfollow]: !result }));
      setLoadingFollowers((prev) => ({ ...prev, [pubkyUnfollow]: false }));
    } catch (error) {
      console.log(error);
    }
  };

  // Render functions
  const renderTag = (tagObj: (typeof tags)[0], index: number) => {
    const isTagFound = tagObj?.relationship || false;
    const displayedImages = tagObj?.taggers || [];
    const extraImagesCount = tagObj.taggers_count - 4;

    return (
      <div className="flex gap-2" key={index}>
        {tagObj && (
          <PostUtil.Tag
            id={`tag-${index}`}
            clicked={isTagFound}
            color={tagObj?.label && Utils.generateRandomColor(tagObj?.label)}
            onClick={() => handleTagClick(tagObj)}
          >
            <div id={`tag-${index}-count`} className="flex gap-2 items-center">
              {Utils.minifyText(tagObj?.label, 20)}
              {loadingTags === tagObj?.label ? (
                <Icon.LoadingSpin size="12" />
              ) : (
                <Typography.Caption variant="bold" className="text-opacity-60">
                  {tagObj?.taggers_count}
                </Typography.Caption>
              )}
            </div>
          </PostUtil.Tag>
        )}
        <Link href={pubky ? `/search?tags=${tagObj?.label}` : ''}>
          <Button.Action
            variant="custom"
            size="small"
            icon={<Icon.MagnifyingGlassLeft size="14" />}
            className="cursor-pointer text-white text-opacity-50 hover:text-opacity-80"
          />
        </Link>
        <div
          className="cursor-pointer flex items-center"
          onClick={() => {
            if (pubky) {
              setSelectedTag(tagObj);
              onTagClick?.(tagObj);
            } else {
              openModal('join');
            }
          }}
        >
          {displayedImages.slice(0, 4).map((image, imageIndex) => (
            <ImageByUri
              id={image}
              width={32}
              height={32}
              key={imageIndex}
              className={`min-w-[32px] max-w-[32px] min-h-[32px] max-h-[32px] rounded-full shadow justify-center items-center flex ${
                imageIndex > 0 && '-ml-2'
              }`}
              alt={`tag-${imageIndex + 1}`}
            />
          ))}
          {extraImagesCount > 0 && <PostUtil.Counter className="-ml-2">+{extraImagesCount}</PostUtil.Counter>}
          <Button.Action variant="custom" icon={<Icon.CaretRight size="16" />} className="-ml-2" size="small" />
        </div>
      </div>
    );
  };

  const renderTaggers = () => (
    <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-webkit pr-4">
      {taggers.map((user, userIndex) => {
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
                onClick={loadingFollowers[user] ? undefined : () => unfollowUser(user)}
                disabled={loadingFollowers[user]}
                loading={loadingFollowers[user]}
                icon={<Icon.Minus size="16" />}
                variant="small"
              />
            ) : (
              <SideCard.FollowAction
                onClick={loadingFollowers[user] ? undefined : () => followUser(user)}
                disabled={loadingFollowers[user]}
                loading={loadingFollowers[user]}
                icon={<Icon.Plus size="16" />}
                variant="small"
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSelectedTag = () => (
    <>
      <div className="flex gap-2 items-center mb-2">
        <div onClick={() => setSelectedTag(null)} className="cursor-pointer">
          <Button.Action variant="custom" icon={<Icon.CaretLeft size="16" />} size="small" />
        </div>
        {selectedTag && (
          <PostUtil.Tag
            clicked={selectedTag?.relationship || false}
            onClick={() => handleTagClick(selectedTag)}
            color={selectedTag?.label && Utils.generateRandomColor(selectedTag?.label)}
          >
            <div className="flex gap-2 items-center">
              {Utils.minifyText(selectedTag?.label, 21)}
              {loadingTags === selectedTag?.label ? (
                <Icon.LoadingSpin size="12" />
              ) : (
                <Typography.Caption variant="bold" className="text-opacity-60">
                  {selectedTag?.taggers_count || 0}
                </Typography.Caption>
              )}
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
      {renderTaggers()}
      {hasMoreTaggers && (
        <div ref={loaderTaggersRef} className="flex justify-center py-2">
          {isLoadingTaggers && <Icon.LoadingSpin size="24" />}
        </div>
      )}
    </>
  );

  const renderTagInput = () => (
    <div className="relative" ref={inputWrapperRef}>
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
          onClick={(event) => {
            event.stopPropagation();
            pubky ? undefined : openModal('join');
          }}
          onAddTag={handleAddTagInput}
          onEmojiPickerClick={pubky ? () => setShowEmojis(true) : () => openModal('join')}
          loading={loadingTag}
          className="w-fit"
          variant="small"
          autoComplete={false}
        />
        {suggestedTagsFromHook.length > 0 && (
          <div className="absolute top-full left-0 mt-1 bg-[#05050A] border border-white border-opacity-20 rounded-lg z-20 w-[200px] max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-webkit">
            {suggestedTagsFromHook.map((tag, index) => (
              <div
                key={index}
                onClick={() => handleSuggestedTagClick(tag)}
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
  );

  return (
    <div className="w-full flex flex-col gap-2">
      {selectedTag ? (
        renderSelectedTag()
      ) : (
        <>
          {renderTagInput()}
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-webkit pr-4">
            {allTags.map((tagObj, index) => renderTag(tagObj, index))}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-2">
                {isLoading && <Icon.LoadingSpin size="24" />}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
