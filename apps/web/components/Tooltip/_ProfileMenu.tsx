'use client';

import { useEffect, useRef } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useClientContext, useToastContext } from '@/contexts';

interface TooltipProfileMenuProps {
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  creatorPubky: string;
}

export default function ProfileMenu({
  setShowProfileMenu,
  creatorPubky,
}: TooltipProfileMenuProps) {
  const router = useRouter();
  const { pubky } = useClientContext();
  const { setContent, setShow } = useToastContext();
  const tooltipProfileMenuRef = useRef<HTMLDivElement>(null);

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
            icon={<Icon.GearSix size="20" />}
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
      </Tooltip.Main>
    </div>
  );
}
