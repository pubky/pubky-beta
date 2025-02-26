'use client';

import { useEffect, useRef } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';

interface TooltipRepostMenuProps {
  setShowRepostMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  handleRepost: () => Promise<void>;
  handleDeleteRepost: () => Promise<void>;
  deleteRepost?: boolean;
}

export default function RepostMenu({
  setShowRepostMenu,
  setShowModalRepost,
  handleRepost,
  handleDeleteRepost,
  deleteRepost = false
}: TooltipRepostMenuProps) {
  const tooltipRepostMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideTooltip = (event: MouseEvent) => {
      if (tooltipRepostMenuRef.current && !tooltipRepostMenuRef.current.contains(event.target as Node)) {
        setShowRepostMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideTooltip);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTooltip);
    };
  }, [tooltipRepostMenuRef, setShowRepostMenu]);

  return (
    <div ref={tooltipRepostMenuRef}>
      <Tooltip.Main
        className={`px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default ${
          deleteRepost ? 'w-[200px]' : 'w-[150px]'
        }`}
      >
        <Tooltip.Item
          onClick={() => {
            setShowRepostMenu(false);
            deleteRepost ? handleDeleteRepost() : handleRepost();
          }}
          icon={<Icon.Repost size="20" />}
        >
          {deleteRepost ? 'Undo repost' : 'Repost'}
        </Tooltip.Item>
        <Tooltip.Item
          onClick={() => {
            setShowRepostMenu(false);
            setShowModalRepost(true);
          }}
          icon={<Icon.PencilLine size="20" />}
        >
          Quote
        </Tooltip.Item>
      </Tooltip.Main>
    </div>
  );
}
