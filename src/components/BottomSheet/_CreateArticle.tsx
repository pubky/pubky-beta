'use client';

import { useState } from 'react';
import { BottomSheet } from '@social/ui-shared';
import ContentCreateArticle from '../Modal/_CreateArticle/_Content';
import { useModal } from '@/contexts';

interface CreateArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreateArticle({ show, setShow, title, className }: CreateArticleProps) {
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
    <BottomSheet.Root show={show} setShow={handleClose} title={title ?? 'New Article'} className={className}>
      <ContentCreateArticle setShowModalArticle={setShow} setHasContent={setHasContent} />
    </BottomSheet.Root>
  );
}
