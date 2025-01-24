'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import ContentCreateArticle from '../Modal/_CreateArticle/_Content';
import { useState } from 'react';
import { BottomSheet } from '.';

interface CreateArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreateArticle({
  show,
  setShow,
  title,
  className,
}: CreateArticleProps) {
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState(false);

  const closeModal = () => {
    if (content) {
      setDraft(true);
    } else {
      setShow(false);
    }
  };

  return (
    <>
      <BottomSheetUI.Root
        show={show}
        setShow={closeModal}
        title={title ?? 'New Article'}
        className={className}
      >
        <ContentCreateArticle
          setContent={setContent}
          setShowModalArticle={setShow}
        />
      </BottomSheetUI.Root>
      <BottomSheet.Draft show={draft} setShow={setDraft} setClose={setShow} />
    </>
  );
}
