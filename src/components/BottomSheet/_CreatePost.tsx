'use client';

import { useState } from 'react';

import { BottomSheet } from '@social/ui-shared';
import ContentCreatePost from '../Modal/_CreatePost/_Content';
import { useModal } from '@/contexts';

interface CreatePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreatePost({ show, setShow, title, className }: CreatePostProps) {
  const { openModal } = useModal();
  const [hasContent, setHasContent] = useState(false);

  const handleClose = () => {
    if (hasContent) {
      openModal('checkContent', { setShow2: setShow });
    } else {
      setShow(false);
    }
  };

  return (
    <BottomSheet.Root show={show} setShow={handleClose} title={title ?? 'New Post'} className={className}>
      <ContentCreatePost className="p-0 border-none" setShowModalPost={setShow} setHasContent={setHasContent} />
    </BottomSheet.Root>
  );
}
