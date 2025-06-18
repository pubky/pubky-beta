'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditPost from '../Modal/_EditPost/_Content';

interface EditPostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function EditPost({ show, setShow, post, setShowMenu, title, className }: EditPostProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'Edit Post'} className={className}>
      <ContentEditPost
        setShowModalEditPost={setShow}
        className="p-0 border-none"
        post={post}
        setShowMenu={setShowMenu}
      />
    </BottomSheet.Root>
  );
}
