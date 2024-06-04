'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';

interface TooltipProfileMenuProps {
  setShowProfileMenu: React.Dispatch<React.SetStateAction<boolean>>;
  pubky: string;
}

export default function ProfileMenu({
  setShowProfileMenu,
  pubky,
}: TooltipProfileMenuProps) {
  const tooltipProfileMenuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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
    } catch (error) {
      console.log('Failed to copy: ', error);
    }
  };

  return (
    <div ref={tooltipProfileMenuRef}>
      <Tooltip.Main className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[250px]">
        <Tooltip.Item
          onClick={() => copyToClipboard(pubky)}
          icon={
            copied ? (
              <Icon.CheckCircle size="20" />
            ) : (
              <Icon.LinkSimple size="20" />
            )
          }
        >
          {copied ? 'Copied' : 'Copy pubky user'}
        </Tooltip.Item>
      </Tooltip.Main>
    </div>
  );
}
