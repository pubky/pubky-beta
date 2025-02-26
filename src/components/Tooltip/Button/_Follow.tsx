'use client';

import { useEffect, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { useUserProfile } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';
import { UserView } from '@/types/User';

interface TooltipMenuProps {
  pk: string;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Follow({ pk, setShowMenu }: TooltipMenuProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const isMobile = useIsMobile();
  const { data: author } = useUserProfile(pk, pubky ?? '');
  const [localAuthor, setLocalAuthor] = useState<UserView | null>(author);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);

  useEffect(() => {
    if (author) {
      setLocalAuthor(author);
      setInitLoadingFollowed(false);
    }
  }, [author]);

  const updateFollowingStatus = (isFollowing: boolean) => {
    setLocalAuthor((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        relationship: {
          ...prev.relationship,
          following: isFollowing
        }
      };
    });
  };

  const followUser = async () => {
    if (!pk) return;

    setLoadingFollowed(true);
    updateFollowingStatus(true);

    try {
      const result = await follow(pk);

      if (!result) {
        updateFollowingStatus(false);
        addAlert('Something went wrong!', 'warning');
      } else {
        setShowMenu(false);
      }
    } catch (error) {
      console.log(error);
      updateFollowingStatus(false);
      addAlert('Error while following!', 'warning');
    } finally {
      setLoadingFollowed(false);
    }
  };

  const unfollowUser = async () => {
    if (!pk) return;

    setLoadingFollowed(true);
    updateFollowingStatus(false);

    try {
      const result = await unfollow(pk);

      if (!result) {
        updateFollowingStatus(true);
        addAlert('Something went wrong!', 'warning');
      } else {
        setShowMenu(false);
      }
    } catch (error) {
      console.log(error);
      updateFollowingStatus(true);
      addAlert('Error while unfollowing!', 'warning');
    } finally {
      setLoadingFollowed(false);
    }
  };

  return initLoadingFollowed ? (
    <Tooltip.Item icon={<Icon.LoadingSpin size="24" />}>Loading</Tooltip.Item>
  ) : localAuthor?.relationship?.following ? (
    <Tooltip.Item
      onClick={loadingFollowed ? undefined : unfollowUser}
      loading={loadingFollowed}
      icon={<Icon.UserMinus size="24" />}
    >
      Unfollow {Utils.minifyText(localAuthor?.details?.name ?? '', isMobile ? 30 : 10)}
    </Tooltip.Item>
  ) : (
    <Tooltip.Item
      onClick={loadingFollowed ? undefined : followUser}
      loading={loadingFollowed}
      icon={<Icon.UserPlus size="24" />}
    >
      Follow {Utils.minifyText(localAuthor?.details?.name ?? '', isMobile ? 30 : 10)}
    </Tooltip.Item>
  );
}
