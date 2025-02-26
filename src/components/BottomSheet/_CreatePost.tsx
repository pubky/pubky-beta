'use client';

import { BottomSheet } from '@social/ui-shared';
import ContentCreatePost from '../Modal/_CreatePost/_Content';

interface CreatePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreatePost({ show, setShow, title, className }: CreatePostProps) {
  return (
    <BottomSheet.Root show={show} setShow={setShow} title={title ?? 'New Post'} className={className}>
      <ContentCreatePost className="p-0 border-none" setShowModalPost={setShow} />
    </BottomSheet.Root>
  );
}
