'use client';

import { useState } from 'react';
import { BottomSheet } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentCreateReply from '../Modal/_CreateReply/_Content';
import { useModal } from '@/contexts';

interface CreateReplyProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function CreateReply({ show, setShow, post, title, className }: CreateReplyProps) {
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
    <BottomSheet.Root show={show} setShow={handleClose} title={title ?? 'Reply'} className={className}>
      <ContentCreateReply
        className="p-0 border-none"
        setShowModalReply={setShow}
        post={post}
        setHasContent={setHasContent}
      />
    </BottomSheet.Root>
  );
}
