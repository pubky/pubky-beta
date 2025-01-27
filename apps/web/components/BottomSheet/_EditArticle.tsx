'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditArticle from '../Modal/_EditArticle/_Content';
import { useState } from 'react';
import { BottomSheet } from '.';

interface EditArticleProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  title?: string;
  className?: string;
}

export default function EditArticle({
  show,
  setShow,
  article,
  title,
  className,
}: EditArticleProps) {
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
        title={title}
        className={className}
      >
        <ContentEditArticle
          className="p-0 border-none"
          setShowModalEditArticle={setShow}
          article={article}
          setContent={setContent}
        />
      </BottomSheetUI.Root>
      <BottomSheet.Draft show={draft} setShow={setDraft} setClose={setShow} />
    </>
  );
}
