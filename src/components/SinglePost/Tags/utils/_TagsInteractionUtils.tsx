'use client';

import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostTag, PostView } from '@/types/Post';
import { UserView } from '@/types/User';
import { useTagsPost } from '@/hooks/useTag';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePostTagTaggers } from '@/hooks/useUser';
import TagsUtils from './_TagsUtils';
import { TagsCommonFunctions } from './_TagsCommonFunctions';

export const TagsInteractionUtils = (post: PostView | undefined) => {
  if (!post) return null;
  const { addAlert } = useAlertContext();
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const [tag, setTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleAddTag, handleDeleteTag, tags: localTags } = TagsUtils(post);
  const { useEmojiPicker } = TagsCommonFunctions;
  const { showEmojis, setShowEmojis, wrapperRefEmojis } = useEmojiPicker();

  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [tagImages, setTagImages] = useState<{ [label: string]: string[] }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>({});
  const [loading, setLoading] = useState(false);
  const limit = 100;
  const [allTags, setAllTags] = useState<PostTag[]>(post?.tags || []);
  const [loadingTags, setLoadingTags] = useState('');
  const [skip, setSkip] = useState(limit);
  const [hasMore, setHasMore] = useState(post?.counts?.tags > limit);
  const limitTaggers = 5;
  const [skipTaggers, setSkipTaggers] = useState(limitTaggers);
  const [taggers, setTaggers] = useState<string[]>([]);
  const [hasMoreTaggers, setHasMoreTaggers] = useState(false);

  const { data: moreTags, isLoading } = useTagsPost(post?.details?.author, post?.details?.id, pubky, skip, limit);

  const loader = useInfiniteScroll(() => {
    if (hasMore && !isLoading) {
      setSkip((prev) => prev + limit);
    }
  }, isLoading);

  const { data: moreTaggers, isLoading: isLoadingTaggers } = usePostTagTaggers(
    post?.details?.author,
    post?.details?.id,
    selectedTag?.label ?? '',
    pubky,
    skipTaggers,
    limitTaggers
  );

  const loaderTaggers = useInfiniteScroll(() => {
    if (hasMoreTaggers && !isLoadingTaggers) {
      setSkipTaggers((prev) => prev + limitTaggers);
    }
  }, isLoadingTaggers);

  const followUser = async (pubkyFollow: string) => {
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

  const unfollowUser = async (pubkyUnfollow: string) => {
    try {
      if (!pubkyUnfollow) return;

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: true
      }));

      const result = await unfollow(pubkyUnfollow);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowedUser((prevState) => ({
        ...prevState,
        [pubkyUnfollow]: !result
      }));

      setLoadingFollowers((prevLoadingUsers) => ({
        ...prevLoadingUsers,
        [pubkyUnfollow]: false
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const addTag = async (tag: string) => {
    try {
      // Check if tag already exists and is not me
      const tagExists = allTags.some((t) => t.label === tag && t.taggers.some((fromItem) => fromItem === pubky));
      if (tagExists) {
        addAlert('This tag has already been added.', 'warning');
        setTag('');
        return;
      }

      setLoadingTags(tag);
      setLoading(true);
      await handleAddTag(tag);
      setTag('');
      setLoading(false);
      setLoadingTags('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error('Error adding tag', error);
    }
  };

  const deleteTag = async (tag: string) => {
    try {
      setLoadingTags(tag);
      await handleDeleteTag(tag);
      setLoadingTags('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error('Error deleting tag', error);
    }
  };

  const fetchAllImages = async () => {
    const imagesMap: { [label: string]: string[] } = {};
    await Promise.all(
      allTags.map(async (tag) => {
        const images = await TagsCommonFunctions.fetchProfileImages(tag, pubky);
        imagesMap[tag.label] = images.slice(0, 4);
      })
    );
    setTagImages(imagesMap);
  };

  useEffect(() => {
    if (localTags?.length > 0) {
      setAllTags((prevTags) => {
        // Get all existing tags that are not in localTags
        const existingTags = prevTags.filter(
          (prevTag) => !localTags.some((localTag) => localTag.label === prevTag.label)
        );
        // Combine existing tags with new localTags and ensure relationship is set for new tags
        const updatedLocalTags = localTags.map((tag) => ({
          ...tag,
          relationship: true // Set relationship to true for newly added tags
        }));
        return [...existingTags, ...updatedLocalTags];
      });
    }
  }, [localTags]);

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
    if (moreTaggers && moreTaggers.users) {
      const { users } = moreTaggers;
      setTaggers((prev) => [...new Set([...prev, ...users])]);
      setHasMoreTaggers(users.length === limitTaggers);
    }
  }, [moreTaggers]);

  useEffect(() => {
    if (taggers.length === 0) return;

    TagsCommonFunctions.fetchProfiles(
      taggers,
      pubky,
      userProfiles,
      setUserProfiles,
      setFollowedUser,
      setInitLoadingFollowers
    );
  }, [taggers, pubky]);

  useEffect(() => {
    if (allTags?.length > 0) {
      fetchAllImages();
    }
  }, [allTags]);

  useEffect(() => {
    if (!isLoading && moreTags && moreTags.length) {
      setAllTags((prev) => {
        // Combine existing tags with new moreTags
        const updatedTags = [...prev];
        moreTags.forEach((newTag) => {
          if (!updatedTags.some((existingTag) => existingTag.label === newTag.label)) {
            updatedTags.push({
              ...newTag,
              relationship: newTag.relationship || false
            });
          }
        });
        setHasMore(moreTags.length === limit);
        return updatedTags;
      });
    }
  }, [moreTags, isLoading, limit]);

  return {
    selectedTag,
    addTag,
    deleteTag,
    allTags,
    setSelectedTag,
    loader,
    loadingTags,
    tagImages,
    hasMore,
    pubky,
    taggers,
    userProfiles,
    followedUser,
    initLoadingFollowers,
    followUser,
    unfollowUser,
    loaderTaggers,
    loadingFollowers,
    hasMoreTaggers,
    tag,
    setTag,
    showEmojis,
    setShowEmojis,
    wrapperRefEmojis,
    loading,
    inputRef
  };
};

export default TagsInteractionUtils;
