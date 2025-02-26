'use client';

import { useEffect, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { usePubkyClientContext } from '@/contexts';
import { useUserProfile } from '@/hooks/useUser';

interface MuteProps {
  pk: string;
}

export default function Mute({ pk }: MuteProps) {
  const { pubky, mute, unmute, setMutedUsers } = usePubkyClientContext();
  const { data: author } = useUserProfile(pk, pubky ?? '');
  const [initLoadingMuted, setInitLoadingMuted] = useState(true);
  const [muted, setMuted] = useState(false);
  const [loadingMuted, setLoadingMuted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (author) {
          setInitLoadingMuted(false);
          if (author?.relationship?.muted) setMuted(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [author]);

  const muteUser = async () => {
    if (!pk) return;

    try {
      setLoadingMuted(true);

      const result = await mute(pk);
      if (result) {
        setMuted(result);
        setMutedUsers((prev) => (prev ? [...prev, pk] : [pk]));
      }
      setLoadingMuted(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unmuteUser = async () => {
    if (!pk) return;

    try {
      setLoadingMuted(true);

      const result = await unmute(pk);
      if (result) {
        setMuted(!result);
        setMutedUsers((prev) => (prev ? prev.filter((user) => user !== pk) : []));
      }
      setLoadingMuted(false);
    } catch (error) {
      console.log(error);
    }
  };

  return initLoadingMuted ? (
    <Tooltip.Item icon={<Icon.LoadingSpin size="24" />}>Loading</Tooltip.Item>
  ) : muted ? (
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
