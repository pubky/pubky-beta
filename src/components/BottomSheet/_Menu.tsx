'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentMenu from '../Tooltip/_Menu/_Content';

interface MenuProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  repost?: PostView;
  title?: string;
  className?: string;
}

export default function Menu({ show, setShow, post, title, className }: MenuProps) {
  return (
    <BottomSheetUI.Root show={show} setShow={setShow} title={title} className={className}>
      <ContentMenu post={post} setShowMenu={setShow} />
    </BottomSheetUI.Root>
  );
}
