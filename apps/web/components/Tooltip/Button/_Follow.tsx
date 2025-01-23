'use client';

import { useEffect, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { useUserProfile } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';

interface TooltipMenuProps {
  pk: string;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Follow({ pk, setShowMenu }: TooltipMenuProps) {
  const { pubky, follow, unfollow } = usePubkyClientContext();
  const { addAlert } = useAlertContext();
  const isMobile = useIsMobile();
  const { data: author } = useUserProfile(pk, pubky ?? '');
  const [followed, setFollowed] = useState(false);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [initLoadingFollowed, setInitLoadingFollowed] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (author) {
          setInitLoadingFollowed(false);
          if (author?.relationship?.following) setFollowed(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [author]);

  const followUser = async () => {
    if (!pk) return;

    setLoadingFollowed(true);
    try {
      const result = await follow(pk);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed(result);
      if (result) setShowMenu(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFollowed(false);
    }
  };

  const unfollowUser = async () => {
    if (!pk) return;

    setLoadingFollowed(true);
    try {
      const result = await unfollow(pk);

      if (!result) {
        addAlert('Something went wrong!', 'warning');
      }

      setFollowed(!result);
      if (result) setShowMenu(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingFollowed(false);
    }
  };

  return initLoadingFollowed ? (
    <Tooltip.Item icon={<Icon.LoadingSpin size="24" />}>Loading</Tooltip.Item>
  ) : followed ? (
    <Tooltip.Item
      onClick={loadingFollowed ? undefined : unfollowUser}
      loading={loadingFollowed}
      icon={<Icon.UserMinus size="24" />}
    >
      Unfollow{' '}
      {Utils.minifyText(author?.details?.name ?? '', isMobile ? 30 : 10)}
    </Tooltip.Item>
  ) : (
    <Tooltip.Item
      onClick={loadingFollowed ? undefined : followUser}
      loading={loadingFollowed}
      icon={<Icon.UserPlus size="24" />}
    >
      Follow {Utils.minifyText(author?.details?.name ?? '', isMobile ? 30 : 10)}
    </Tooltip.Item>
  );
}
