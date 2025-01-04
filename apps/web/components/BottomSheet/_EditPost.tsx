'use client';

import { BottomSheet } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditPost from '../Modal/_EditPost/_Content';

interface EditPostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function EditPost({
  show,
  setShow,
  post,
  title,
  className,
}: EditPostProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title}
      className={className}
    >
      <ContentEditPost setShowModalEditPost={setShow} post={post} />
    </BottomSheet.Root>
  );
}
