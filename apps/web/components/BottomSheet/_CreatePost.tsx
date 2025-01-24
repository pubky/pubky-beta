'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import ContentCreatePost from '../Modal/_CreatePost/_Content';
import { BottomSheet } from '.';
import { useState } from 'react';

interface CreatePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  className?: string;
}

export default function CreatePost({
  show,
  setShow,
  title,
  className,
}: CreatePostProps) {
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
        <ContentCreatePost
          className="p-0 border-none"
          setShowModalPost={setShow}
          setContent={setContent}
        />
      </BottomSheetUI.Root>
      <BottomSheet.Draft show={draft} setShow={setDraft} setClose={setShow} />
    </>
  );
}
