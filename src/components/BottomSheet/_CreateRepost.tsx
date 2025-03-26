'use client';

import { useState } from 'react';
import { BottomSheet } from '@social/ui-shared';
import ContentCreateRepost from '../Modal/_CreateRepost/_Content';
import { PostView } from '@/types/Post';
import { useModal } from '@/contexts';

interface CreateRepostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function CreateRepost({ show, setShow, post, title, className }: CreateRepostProps) {
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
    <BottomSheet.Root show={show} setShow={handleClose} title={title ?? 'Repost'} className={className}>
      <ContentCreateRepost
        className="p-0 border-none"
        setShowModalRepost={setShow}
        post={post}
        setHasContent={setHasContent}
      />
    </BottomSheet.Root>
  );
}
