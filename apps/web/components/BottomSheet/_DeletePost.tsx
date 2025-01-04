'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentDeletePost from '../Modal/_DeletePost/_Content';

interface DeletePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletePost: () => void;
  title?: string;
  className?: string;
}

export default function DeletePost({
  show,
  setShow,
  handleDeletePost,
  title,
  className,
}: DeletePostProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Delete Post'}
      className={className}
    >
      <ContentDeletePost
        setShowModalDeletePost={setShow}
        handleDeletePost={handleDeletePost}
      />
    </BottomSheet.Root>
  );
}
