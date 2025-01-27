'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditPost from '../Modal/_EditPost/_Content';
import { useState } from 'react';
import { BottomSheet } from '.';

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
        <ContentEditPost
          setShowModalEditPost={setShow}
          className="p-0 border-none"
          post={post}
          handleCloseModal={() => setShow(false)}
          setContent={setContent}
        />
      </BottomSheetUI.Root>
      <BottomSheet.Draft show={draft} setShow={setDraft} setClose={setShow} />
    </>
  );
}
