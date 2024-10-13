'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { usePubkyClientContext, useToastContext } from '@/contexts';
import { Utils } from '@social/utils-shared';
import { UseUserStreamMuted } from '@/hooks/useUser';

interface TooltipProfileMenuProps {
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky: string;
  name: string;
}

export default function ProfileMenu({
  setShowProfileMenu,
  creatorPubky,
  name = 'User',
}: TooltipProfileMenuProps) {
  const router = useRouter();
  const { pubky, mute, unmute } = usePubkyClientContext();
  const { data, isLoading, isError } = UseUserStreamMuted(
    pubky ?? '',
    pubky ?? '',
    0,
    1
  );
  if (isError) console.error(isError);
  console.log('DATAMuted', data);
  console.log("loading", isLoading)
  const { setContent, setShow } = useToastContext();
  const [muted, setMuted] = useState(false);
  const [loadingMuted, setLoadingMuted] = useState(true);
  const tooltipProfileMenuRef = useRef<HTMLDivElement>(null);

  const muteUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingMuted(true);

      const result = await mute(creatorPubky);
      setMuted(result);
      setLoadingMuted(false);
    } catch (error) {
      console.log(error);
    }
  };

  const unmuteUser = async () => {
    try {
      if (!creatorPubky) return;
      setLoadingMuted(true);

      const result = await unmute(creatorPubky);
      setMuted(!result);
      setLoadingMuted(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutsideTooltip = (event: MouseEvent) => {
      if (
        tooltipProfileMenuRef.current &&
        !tooltipProfileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideTooltip);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTooltip);
    };
  }, [tooltipProfileMenuRef, setShowProfileMenu]);

  const copyToClipboard = async (pubky: string) => {
    try {
      await navigator.clipboard.writeText(`pk:${pubky}`);
      setShowProfileMenu(false);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  const copyProfileUrlToClipboard = async (pubky: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${pubky}`
      );
      setShowProfileMenu(false);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  return (
    <div ref={tooltipProfileMenuRef}>
      <Tooltip.Main className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[250px]">
        {pubky === creatorPubky && (
          <Tooltip.Item
            onClick={() => {
              router.push('/settings/edit');
              setShowProfileMenu(false);
            }}
            icon={<Icon.Pencil size="20" />}
          >
            Edit profile
          </Tooltip.Item>
        )}
        <Tooltip.Item
          onClick={() => {
            setContent(`pk:${creatorPubky}`, 'pubky');
            setShow(true);
            copyToClipboard(creatorPubky);
          }}
          icon={<Icon.Key size="20" />}
        >
          Copy user pubky
        </Tooltip.Item>
        <Tooltip.Item
          onClick={() => {
            setContent(`${window.location.origin}/profile/${pubky}`, 'link');
            setShow(true);
            copyProfileUrlToClipboard(creatorPubky);
          }}
          icon={<Icon.Link size="20" />}
        >
          Copy profile link
        </Tooltip.Item>
        {pubky !== creatorPubky && isLoading ? (
          <Tooltip.Item
            loading={isLoading}
            icon={<Icon.LoadingSpin size="20" />}
          >
            Loading...
          </Tooltip.Item>
        ) : muted ? (
          <Tooltip.Item
            loading={loadingMuted}
            onClick={loadingMuted ? undefined : () => unmuteUser()}
            icon={<Icon.SpeakerSimpleSlash size="20" />}
          >
            Unmute {Utils.minifyText(name, 10)}
          </Tooltip.Item>
        ) : (
          <Tooltip.Item
            loading={loadingMuted}
            onClick={loadingMuted ? undefined : () => muteUser()}
            icon={<Icon.SpeakerSimpleSlash size="20" />}
          >
            Mute {Utils.minifyText(name, 10)}
          </Tooltip.Item>
        )}
      </Tooltip.Main>
    </div>
  );
}
