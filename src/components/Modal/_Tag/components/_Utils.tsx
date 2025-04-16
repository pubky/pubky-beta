import { useEffect, useRef, useState } from 'react';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostTag, PostType, PostView } from '@/types/Post';
import { getUserProfile } from '@/services/userService';
import { UserView } from '@/types/User';
import { useTagsPost } from '@/hooks/useTag';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePostTagTaggers } from '@/hooks/useUser';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
import { useTagsLogic } from '@/components/Post/Tags/components/TagsUtils';

export const useUtilsTag = (post: PostView, postType: PostType) => {
  const { addAlert } = useAlertContext();
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { handleAddTag, handleDeleteTag } = useTagsLogic(post, postType);
  const [tag, setTag] = useState('');
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedTag, setSelectedTag] = useState<PostTag | null>(null);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [showEmojis, setShowEmojis] = useState(false);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>({});
  const [loading, setLoading] = useState(false);
  const limit = 5;
  const [allTags, setAllTags] = useState<PostTag[]>(post?.tags);
  const [loadingTags, setLoadingTags] = useState('');
  const [skip, setSkip] = useState(limit);
  const [hasMore, setHasMore] = useState(post.counts?.tags > limit);
  const limitTaggers = 5;
  const [skipTaggers, setSkipTaggers] = useState(limitTaggers);
  const [taggers, setTaggers] = useState<string[]>([]);
  const [hasMoreTaggers, setHasMoreTaggers] = useState(false);

  const { data: moreTags, isLoading } = useTagsPost(post.details.author, post.details.id, pubky, skip, limit);

  const { data: moreTaggers, isLoading: isLoadingTaggers } = usePostTagTaggers(
    post.details.author,
    post.details.id,
    selectedTag?.label ?? '',
    pubky,
    skipTaggers,
    limitTaggers
  );

  useEffect(() => {
    setAllTags(post?.tags);
  }, [post?.tags]);
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
    if (!isLoading && moreTags) {
      setAllTags((prev) => {
        const updatedTags = [...prev, ...moreTags];
        const uniqueTags = updatedTags.filter(
          (tag, index, self) => index === self.findIndex((t) => t.label === tag.label)
        );
        setHasMore(moreTags.length === limit);
        return uniqueTags;
      });
    } else if (!isLoading && !moreTags) {
      setHasMore(false);
    }
  }, [moreTags, isLoading]);

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

  const fetchProfileImages = async (tag: PostTag) => {
    const images = await Promise.all(
      tag.taggers.map((fromItem) => {
        return fromItem;
      })
    );
    return images;
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithoutSpaces = e.target.value.toLowerCase().replace(/\s/g, '');
    setTag(valueWithoutSpaces);
  };

  const addTag = async (tag: string) => {
    try {
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

  useEffect(() => {
    if (selectedTag) {
      const updatedTag = allTags.find((tag) => tag.label === selectedTag.label);
      if (updatedTag && setSelectedTag) {
        setSelectedTag(updatedTag);
      }
    }
  }, [allTags]);

  return {
    tag,
    setTag,
    handleChange,
    addTag,
    deleteTag,
    showEmojis,
    setShowEmojis,
    allTags,
    selectedTag,
    setSelectedTag,
    taggers,
    userProfiles,
    followedUser,
    followUser,
    unfollowUser,
    loader,
    loaderTaggers,
    loadingTags,
    loadingFollowers,
    wrapperRefEmojis,
    initLoadingFollowers,
    loading,
    inputRef,
    hasMore,
    hasMoreTaggers,
    pubky
  };
};
