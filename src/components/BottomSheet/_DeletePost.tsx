'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentDeletePost from '../Modal/_DeletePost/_Content';
import { PostView } from '@/types/Post';

interface DeletePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function DeletePost({ show, setShow, setShowMenu, post, title, className }: DeletePostProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Delete Post'} className={className}>
      <ContentDeletePost setShowModalDeletePost={setShow} setShowMenu={setShowMenu} post={post} />
    </BottomSheet.Root>
  );
}
