'use client';

import { useEffect, useRef } from 'react';
import { Tooltip } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentMenu from './_Content';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function Menu({ post, setShowMenu }: TooltipMenuProps) {
  const tooltipMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideTooltip = (event: MouseEvent) => {
      if (
        tooltipMenuRef.current &&
        !tooltipMenuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideTooltip);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideTooltip);
    };
  }, [tooltipMenuRef, setShowMenu]);

  return (
    <div ref={tooltipMenuRef}>
      <Tooltip.Main
        id="post-tooltip-menu"
        className="px-3 py-2 bottom-0 -translate-x-[105%] translate-y-[90%] cursor-default w-[282px] z-40"
      >
        <ContentMenu post={post} setShowMenu={setShowMenu} />
      </Tooltip.Main>
    </div>
  );
}
