'use client';
import { useRef, useState } from 'react';
import { PostTag, PostView } from '@/types/Post';
import { getUserProfile } from '@/services/userService';
import { UserView } from '@/types/User';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';

/**
 * Function to add a tag to a post
 * @param tag Tag to be added
 * @param localPost Current post
 * @param createTag Function to create tag in backend
 * @param setLocalPost Function to update local post
 * @param addAlert Function to display alerts
 * @param tagInput Current tag input
 * @param setTagInput Function to update tag input
 * @param setAddTagInput Function to update add tag state
 * @param setLoadingTags Function to update loading state
 */
export const handleAddTag = async (
  tag: string,
  localPost: PostView,
  createTag: (author: string, postId: string, tag: string) => Promise<any>,
  setLocalPost: (post: PostView) => void,
  addAlert: (message: string, type: string) => void,
  tagInput: string,
  setTagInput: (value: string) => void,
  setAddTagInput: (value: boolean) => void,
  setLoadingTags: (value: string) => void
) => {
  if (!tag) return;

  // check if the tag already exists in the localPost.tags array, and the author is not the author of the post, and the count is greater than 0
  const tagExists = localPost.tags.some(
    (t) => t.label === tag && t.taggers.includes(localPost.details.author) && t.taggers_count > 0
  );
  if (tagExists) {
    addAlert('Tag already exists', 'warning');
    return;
  }

  setLoadingTags(tag);
  const response = await createTag(localPost.details.author, localPost.details.id, tag);
  if (response) {
    // check if the tag already exists in the localPost.tags array
    const tagExists = localPost.tags.some((t) => t.label === tag);
    if (tagExists) {
      const updatedTags = localPost.tags.map((t) =>
        t.label === tag
          ? { ...t, taggers: [...t.taggers, localPost.details.author], taggers_count: t.taggers_count + 1 }
          : t
      );
      setLocalPost({ ...localPost, tags: updatedTags });
    } else {
      const updatedTags = [...localPost.tags, { label: tag, taggers: [localPost.details.author], taggers_count: 1 }];
      setLocalPost({ ...localPost, tags: updatedTags });
    }
    if (tag === tagInput) {
      setTagInput('');
      setAddTagInput(false);
    }
  } else {
    addAlert('Something went wrong', 'warning');
  }
  setLoadingTags('');
};

/**
 * Function to remove a tag from a post
 * @param tag Tag to be removed
 * @param localPost Current post
 * @param deleteTag Function to delete tag in backend
 * @param setLocalPost Function to update local post
 * @param addAlert Function to display alerts
 * @param setLoadingTags Function to update loading state
 */
export const handleDeleteTag = async (
  tag: string,
  localPost: PostView,
  deleteTag: (author: string, postId: string, tag: string) => Promise<any>,
  setLocalPost: (post: PostView) => void,
  addAlert: (message: string, type: string) => void,
  setLoadingTags: (value: string) => void
) => {
  setLoadingTags(tag);
  const response = await deleteTag(localPost.details.author, localPost.details.id, tag);
  if (response) {
    // check if pubky already is a tagger of the tag
    const tagExists = localPost.tags.some((t) => t.taggers.includes(localPost.details.author));
    if (tagExists) {
      const updatedTags = localPost.tags.map((t) =>
        t.label === tag
          ? {
              ...t,
              taggers: t.taggers.filter((tagger) => tagger !== localPost.details.author),
              taggers_count: t.taggers_count - 1
            }
          : t
      );
      setLocalPost({ ...localPost, tags: updatedTags });
    } else {
      const updatedTags = localPost.tags.filter((t) => t.label !== tag);
      setLocalPost({ ...localPost, tags: updatedTags });
    }
  } else {
    addAlert('Something went wrong', 'warning');
  }
  setLoadingTags('');
};

/**
 * Function to sanitize tag input
 * @param value Input value
 * @returns Sanitized value
 */
export const sanitizeTagInput = (value: string): string => {
  return value.toLowerCase().replace(/\s/g, '').replace(/!/g, '');
};

/**
 * Function to add a simple tag to an array
 * @param tag Tag to be added
 * @param tags Current tags array
 * @param setTags Function to update tags array
 * @param setTag Function to update tag input
 * @param setTagsError Function to update tags error state
 * @returns Boolean indicating if the tag was added
 */
export const handleAddSimpleTag = (
  tag: string,
  tags: string[],
  setTags: (tags: string[]) => void,
  setTag: (tag: string) => void,
  setTagsError: (error: boolean) => void
): boolean => {
  const trimmedTag = tag.trim();
  if (!trimmedTag || tags.includes(trimmedTag)) return false;

  if (tags.length >= 4) {
    setTagsError(true);
    return false;
  }

  const updatedTags = [...tags, trimmedTag];
  setTags(updatedTags);
  setTag('');
  return true;
};

/**
 * Function to remove a simple tag from an array
 * @param indexToRemove Index of the tag to be removed
 * @param tags Current tags array
 * @param setTags Function to update tags array
 * @param setTagsError Function to update tags error state
 */
export const handleRemoveSimpleTag = (
  indexToRemove: number,
  tags: string[],
  setTags: (tags: string[]) => void,
  setTagsError: (error: boolean) => void
): void => {
  const updatedTags = tags.filter((_, index) => index !== indexToRemove);
  setTags(updatedTags);
  if (updatedTags.length < 4) setTagsError(false);
};

/**
 * Function to fetch profile images for tags
 * @param tag Tag object
 * @param pubky Current user pubky
 * @returns Array of image URLs
 */
export const fetchProfileImages = async (tag: PostTag, pubky: string | null): Promise<string[]> => {
  const images = await Promise.all(
    tag.taggers.map(async (fromItem) => {
      try {
        const profile = await getUserProfile(fromItem, pubky ?? '');
        return profile?.details?.image || '/images/webp/Userpic.webp';
      } catch (error) {
        return '/images/webp/Userpic.webp';
      }
    })
  );
  return images;
};

/**
 * Function to update tags and timeline
 * @param tag Tag to update
 * @param isAdding Whether adding or removing tag
 * @param tags Current tags
 * @param pubky Current user pubky
 * @param setTags Function to update tags
 * @param setTimeline Function to update timeline
 * @param post Current post
 */
export const updateTagsAndTimeline = (
  tag: string,
  isAdding: boolean,
  tags: PostTag[],
  pubky: string | null,
  setTags: (tags: PostTag[]) => void,
  setTimeline: (callback: (prev: PostView[]) => PostView[]) => void,
  post: PostView
) => {
  let newTags = tags;
  const existingTag = tags.find((t) => t.label === tag);
  let uniqueTagsChange = 0;

  if (isAdding) {
    if (!existingTag) {
      newTags = [
        ...tags,
        {
          label: tag,
          taggers_count: 1,
          taggers: [pubky ?? ''],
          relationship: true
        }
      ];
      uniqueTagsChange = 1;
    } else if (!existingTag.taggers.includes(pubky ?? '')) {
      newTags = tags.map((t) =>
        t.label === tag
          ? {
              ...t,
              taggers_count: t.taggers_count + 1,
              taggers: [...t.taggers, pubky ?? ''],
              relationship: true
            }
          : t
      );
      if (existingTag.taggers_count === 0) uniqueTagsChange = 1;
    }
  } else {
    newTags = tags.map((t) =>
      t.label === tag
        ? {
            ...t,
            taggers_count: t.taggers_count - 1,
            taggers: t.taggers.filter((tg) => tg !== pubky),
            relationship: false
          }
        : t
    );
    if (existingTag?.taggers_count === 1) uniqueTagsChange = -1;
  }

  setTags(newTags);
  setTimeline((prev) =>
    prev.map((p) =>
      p.details.id === post.details.id
        ? {
            ...p,
            tags: newTags,
            counts: {
              ...p.counts,
              unique_tags: Math.max(0, p.counts.unique_tags + uniqueTagsChange)
            }
          }
        : p
    )
  );
};

/**
 * Hook to handle emoji picker
 * @returns Emoji picker state and functions
 */
export const useEmojiPicker = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);

  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));

  return {
    showEmojis,
    setShowEmojis,
    wrapperRefEmojis
  };
};

/**
 * Hook to handle simple tags
 * @param initialTags Initial tags array
 * @returns Tags state and functions
 */
export const useSimpleTags = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tag, setTag] = useState('');
  const [tagsError, setTagsError] = useState(false);
  const { showEmojis, setShowEmojis, wrapperRefEmojis } = useEmojiPicker();

  const addTag = () => {
    handleAddSimpleTag(tag, tags, setTags, setTag, setTagsError);
  };

  const removeTag = (indexToRemove: number) => {
    handleRemoveSimpleTag(indexToRemove, tags, setTags, setTagsError);
  };

  return {
    tags,
    setTags,
    tag,
    setTag,
    tagsError,
    setTagsError,
    showEmojis,
    setShowEmojis,
    wrapperRefEmojis,
    addTag,
    removeTag
  };
};

/**
 * Function to fetch profiles for taggers
 * @param taggers Array of tagger IDs
 * @param pubky Current user pubky
 * @param userProfiles Current user profiles
 * @param setUserProfiles Function to update user profiles
 * @param setFollowedUser Function to update followed users
 * @param setInitLoadingFollowers Function to update loading state
 */
export const fetchProfiles = async (
  taggers: string[],
  pubky: string | null,
  userProfiles: { [key: string]: UserView },
  setUserProfiles: (callback: (prev: { [key: string]: UserView }) => { [key: string]: UserView }) => void,
  setFollowedUser: (callback: (prev: { [key: string]: boolean }) => { [key: string]: boolean }) => void,
  setInitLoadingFollowers: (value: boolean) => void
) => {
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

export const TagsCommonFunctions = {
  handleAddTag,
  handleDeleteTag,
  sanitizeTagInput,
  fetchProfileImages,
  updateTagsAndTimeline,
  useEmojiPicker,
  fetchProfiles,
  handleAddSimpleTag,
  handleRemoveSimpleTag,
  useSimpleTags
};

export default TagsCommonFunctions;
