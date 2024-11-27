'use client';

import { useEffect, useRef } from 'react';
import { Tooltip } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import { ButtonTooltip } from './Button';
import { usePubkyClientContext } from '@/contexts';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function Menu({ post, repost, setShowMenu }: TooltipMenuProps) {
  const { pubky } = usePubkyClientContext();
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
        {post?.details?.author !== pubky && (
          <ButtonTooltip.Follow
            pk={post?.details?.author}
            setShowMenu={setShowMenu}
          />
        )}
        {/**post?.details?.author === pubky && (
            <ButtonTooltip.EditProfile setShowMenu={setShowMenu}/>
          )*/}
        <ButtonTooltip.EditPost post={post} />
        <ButtonTooltip.CopyUserPubky
          pk={post?.details?.author}
          setShowMenu={setShowMenu}
        />
        <ButtonTooltip.CopyLinkPost post={post} setShowMenu={setShowMenu} />
        <ButtonTooltip.CopyTextPost post={post} setShowMenu={setShowMenu} />
        {/**<ButtonTooltip.Bookmark post={post} repost={repost} setShowMenu={setShowMenu} />*/}
        {post?.details?.author !== pubky && (
          <ButtonTooltip.Mute pk={post?.details?.author} />
        )}
        <ButtonTooltip.DeletePost post={post} setShowMenu={setShowMenu} />
      </Tooltip.Main>
    </div>
  );
}
