'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import ContentCreateRepost from '../Modal/_CreateRepost/_Content';
import { PostView } from '@/types/Post';
import { useState } from 'react';
import { BottomSheet } from '.';

interface CreateRepostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function CreateRepost({
  show,
  setShow,
  post,
  title,
  className,
}: CreateRepostProps) {
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
        <ContentCreateRepost
          className="p-0 border-none"
          setShowModalRepost={setShow}
          setContent={setContent}
          post={post}
        />
      </BottomSheetUI.Root>
      <BottomSheet.Draft show={draft} setShow={setDraft} setClose={setShow} />
    </>
  );
}
