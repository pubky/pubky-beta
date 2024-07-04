'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useRouter } from 'next/navigation';
import { useClientContext } from '@/contexts';

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
  const tooltipProfileMenuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

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
      setCopied(true);
      await navigator.clipboard.writeText(`pk:${pubky}`);
      setTimeout(() => setCopied(false), 1000);
      setShowProfileMenu(false);
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  const copyProfileUrlToClipboard = async (pubky: string) => {
    try {
      setCopiedUrl(true);
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${pubky}`
      );
      setTimeout(() => setCopiedUrl(false), 1000);
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
              router.push('/settings');
              setShowProfileMenu(false);
            }}
            icon={<Icon.GearSix size="20" />}
          >
            Edit profile
          </Tooltip.Item>
        )}
        <Tooltip.Item
          onClick={() => copyToClipboard(creatorPubky)}
          icon={
            copied ? (
              <Icon.CheckCircle size="20" />
            ) : (
              <Icon.UserCircle size="20" />
            )
          }
        >
          {copied ? 'Copied' : 'Copy user Pubky'}
        </Tooltip.Item>
        <Tooltip.Item
          onClick={() => copyProfileUrlToClipboard(creatorPubky)}
          icon={
            copiedUrl ? (
              <Icon.CheckCircle size="20" />
            ) : (
              <Icon.LinkSimple size="20" />
            )
          }
        >
          {copiedUrl ? 'Copied' : 'Copy profile link'}
        </Tooltip.Item>
      </Tooltip.Main>
    </div>
  );
}
