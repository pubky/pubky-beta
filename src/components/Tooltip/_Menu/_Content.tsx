'use client';

import { usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { ButtonTooltip } from '../Button';

interface TooltipMenuProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  repost?: PostView;
}

export default function ContentMenu({ post, setShowMenu }: TooltipMenuProps) {
  const { pubky } = usePubkyClientContext();

  return (
    <>
      {post?.details?.author !== pubky && <ButtonTooltip.Follow pk={post?.details?.author} setShowMenu={setShowMenu} />}
      <ButtonTooltip.EditPost post={post} setShowMenu={setShowMenu} />
      <ButtonTooltip.CopyUserPubky pk={post?.details?.author} setShowMenu={setShowMenu} />
      <ButtonTooltip.CopyLinkPost post={post} setShowMenu={setShowMenu} />
      <ButtonTooltip.CopyTextPost post={post} setShowMenu={setShowMenu} />
      {post?.details?.author !== pubky && <ButtonTooltip.Mute pk={post?.details?.author} />}
      <ButtonTooltip.DeletePost post={post} setShowMenu={setShowMenu} />
      {post?.details?.author !== pubky && <ButtonTooltip.ReportPost post={post} setShowMenu={setShowMenu} />}
    </>
  );
}
