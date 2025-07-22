'use client';

import { useEffect, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { useUserProfile } from '@/hooks/useUser';
import { userProfileCache } from '@/components/utils-shared/lib/Helper/userProfileCache';
import { UserView } from '@/types/User';

interface MuteProps {
  pk: string;
}

export default function Mute({ pk }: MuteProps) {
  const { pubky, mute, unmute, setMutedUsers } = usePubkyClientContext();
  const { data: author } = useUserProfile(pk, pubky ?? '');
  const [localAuthor, setLocalAuthor] = useState<UserView | null>(author);
  const [loadingMuted, setLoadingMuted] = useState(false);
  const [initLoadingMuted, setInitLoadingMuted] = useState(true);

  useEffect(() => {
    if (author) {
      setLocalAuthor(author);
      setInitLoadingMuted(false);
    }
  }, [author]);

  const updateMutedStatus = (isMuted: boolean) => {
    setLocalAuthor((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        relationship: {
          ...prev.relationship,
          muted: isMuted
        }
      };
    });
  };

  const muteUser = async () => {
    if (!pk) return;
    setLoadingMuted(true);
    updateMutedStatus(true);
    try {
      const result = await mute(pk);
      if (!result) {
        updateMutedStatus(false);
      } else {
        setMutedUsers((prev) => (prev ? [...prev, pk] : [pk]));
        userProfileCache.delete(pk);
      }
    } catch (error) {
      console.log(error);
      updateMutedStatus(false);
    } finally {
      setLoadingMuted(false);
    }
  };

  const unmuteUser = async () => {
    if (!pk) return;
    setLoadingMuted(true);
    updateMutedStatus(false);
    try {
      const result = await unmute(pk);
      if (!result) {
        updateMutedStatus(true);
      } else {
        setMutedUsers((prev) => (prev ? prev.filter((user) => user !== pk) : []));
        userProfileCache.delete(pk);
      }
    } catch (error) {
      console.log(error);
      updateMutedStatus(true);
    } finally {
      setLoadingMuted(false);
    }
  };

  return initLoadingMuted ? (
    <Tooltip.Item icon={<Icon.LoadingSpin size="24" />}>Loading</Tooltip.Item>
  ) : localAuthor?.relationship?.muted ? (
    <Tooltip.Item
      id="profile-menu-item-unmute"
      onClick={loadingMuted ? undefined : unmuteUser}
      loading={loadingMuted}
      icon={<Icon.SpeakerSimpleSlash size="24" />}
    >
      Unmute user
    </Tooltip.Item>
  ) : (
    <Tooltip.Item
      id="profile-menu-item-mute"
      onClick={loadingMuted ? undefined : muteUser}
      loading={loadingMuted}
      icon={<Icon.SpeakerHigh size="24" />}
    >
      Mute user
    </Tooltip.Item>
  );
}
