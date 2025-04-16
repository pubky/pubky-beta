'use client';

import { useEffect, useRef, useState } from 'react';
import { UserTags, UserView } from '@/types/User';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { getUserProfile } from '@/services/userService';
import { PostTag } from '@/types/Post';
import { useTagsUser } from '@/hooks/useTag';
import { useUserTagTaggers } from '@/hooks/useUser';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';

interface UtilsProps extends React.HTMLAttributes<HTMLDivElement> {
  profileTags: UserTags[];
  setProfileTags: React.Dispatch<React.SetStateAction<UserTags[]>>;
  pubkyUser?: string;
  user?: UserView | null;
}

export const useUtilsTag = ({ profileTags, setProfileTags, pubkyUser, user }: UtilsProps) => {
  const { pubky, follow, unfollow, createTagProfile, deleteTagProfile } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const [tag, setTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedTag, setSelectedTag] = useState<UserTags | null>(null);
  const [initLoadingFollowers, setInitLoadingFollowers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [followedUser, setFollowedUser] = useState<{
    [pubky: string]: boolean;
  }>({});
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserView }>({});
  const wrapperRefEmojis = useRef<HTMLDivElement>(null);
  useDrawerClickOutside(wrapperRefEmojis, () => setShowEmojis(false));
  const limit = 5;
  const [allTags, setAllTags] = useState<PostTag[]>(profileTags?.slice(0, limit));
  const [loadingTags, setLoadingTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(limit);
  const [hasMore, setHasMore] = useState(user && user?.counts?.tags > limit);
  const limitTaggers = 5;
  const [skipTaggers, setSkipTaggers] = useState(limitTaggers);
  const [taggers, setTaggers] = useState<string[]>([]);
  const [hasMoreTaggers, setHasMoreTaggers] = useState(false);

  const { data: moreTags, isLoading } = useTagsUser(user?.details.id ?? '', pubky, skip, limit);

  const { data: moreTaggers, isLoading: isLoadingTaggers } = useUserTagTaggers(
    user?.details.id,
    selectedTag?.label,
    pubky,
    skipTaggers,
    limitTaggers
  );

  useEffect(() => {
    const uniqueTags = profileTags?.filter(
      (tag, index, self) => index === self.findIndex((t) => t.label === tag.label)
    );
    if (JSON.stringify(uniqueTags) !== JSON.stringify(allTags)) {
      setAllTags(uniqueTags);
    }
  }, [profileTags]);

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
    } else {
      setHasMoreTaggers(false);
    }
  }, [moreTaggers]);

  useEffect(() => {
    if (!isLoading && moreTags && moreTags.length) {
      setAllTags((prev = []) => {
        const updatedTags = [...prev, ...moreTags];
        const uniqueTags = updatedTags.filter(
          (tag, index, self) => index === self.findIndex((t) => t.label === tag.label)
        );
        setHasMore(uniqueTags.length > prev.length);
        return uniqueTags;
      });
    }
  }, [moreTags, isLoading]);

  useEffect(() => {
    if (selectedTag) {
      const updatedTag = profileTags.find((tag) => tag.label === selectedTag.label);
      if (updatedTag && setSelectedTag) {
        setSelectedTag(updatedTag);
      }
    }
  }, [profileTags]);

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

  const handleAddProfileTag = async (tag: string) => {
    // loading tag
    setLoadingTags(tag);
    if (pubkyUser) {
      // before adding tag, check if tag already exists and is not the same pubky
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        // check if tag is the same pubky
        if (tagExists.taggers.includes(pubky || '')) {
          setLoadingTags('');
        } else {
          // add tag to taggers
          tagExists.taggers_count++;

          // update profileTags with new taggers
          const newProfileTags = profileTags.map((t) => {
            if (t.label === tag) {
              return {
                ...t,
                taggers: [...t.taggers, pubky || ''],
                relationship: true
              };
            }
            return t;
          });

          // update tag in UI
          setProfileTags(newProfileTags);
        }
      } else {
        // update tag optimistic in the UI
        setProfileTags([
          {
            label: tag,
            taggers: [pubky || ''],
            taggers_count: 1,
            relationship: true
          },
          ...profileTags
        ]);
      }
      const response = await createTagProfile(pubkyUser, tag);
      if (!response) {
        // show error message
        addAlert('Error adding tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  const handleDeleteProfileTag = async (tag: string) => {
    // loading tag
    setLoadingTags(tag);

    if (pubkyUser) {
      // check if tag exists in profileTags
      const tagExists = profileTags.find((t) => t.label === tag);

      if (tagExists) {
        // check if usePubky is in taggers
        if (tagExists.taggers.includes(pubky || '')) {
          // remove tagger from tag but keep the tag but update the taggers_count
          if (tagExists.taggers_count >= 1) {
            tagExists.taggers_count--;
          }
          tagExists.taggers = tagExists.taggers.filter((t) => t !== pubky || '');
          setProfileTags(profileTags.map((t) => (t.label === tag ? { ...tagExists, relationship: false } : t)));
        } else {
          // remove tag from taggers
          if (tagExists.taggers_count >= 1) {
            tagExists.taggers_count--;
          }
          tagExists.taggers = tagExists.taggers.filter((t) => t !== pubky || '');
          setProfileTags(profileTags.map((t) => (t.label === tag ? { ...tagExists, relationship: false } : t)));
        }
      }

      const response = await deleteTagProfile(pubkyUser, tag);
      if (!response) {
        addAlert('Error deleting tag', 'warning');
      }
      setLoadingTags('');
    }
  };

  const fetchProfileImages = async (tag: PostTag) => {
    const images = await Promise.all(
      tag.taggers.map(async (fromItem) => {
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

  const addProfileTag = (tag: string) => {
    if (!tag.trim()) return;

    try {
      setLoadingTags(tag);
      setLoading(true);
      handleAddProfileTag(tag);
      setTag('');
      setLoading(false);
      setLoadingTags('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Error adding profile tag', error);
    }
  };

  const deleteProfileTag = (tag: string) => {
    try {
      setLoadingTags(tag);
      handleDeleteProfileTag(tag);
      setLoadingTags('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error('Error deleting profile tag', error);
    }
  };

  return {
    showEmojis,
    setShowEmojis,
    wrapperRefEmojis,
    setTag,
    tag,
    inputRef,
    loading,
    handleChange,
    addProfileTag,
    selectedTag,
    setSelectedTag,
    allTags,
    deleteProfileTag,
    loadingTags,
    hasMore,
    loader,
    pubky,
    taggers,
    userProfiles,
    followedUser,
    initLoadingFollowers,
    loadingFollowers,
    unfollowUser,
    followUser,
    hasMoreTaggers,
    loaderTaggers
  };
};
