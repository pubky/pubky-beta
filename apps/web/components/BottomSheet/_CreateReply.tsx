'use client';

import { BottomSheet as BottomSheetUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentCreateReply from '../Modal/_CreateReply/_Content';
import { useState } from 'react';
import { BottomSheet } from '.';

interface CreateReplyProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  title?: string;
  className?: string;
}

export default function CreateReply({
  show,
  setShow,
  post,
  title,
  className,
}: CreateReplyProps) {
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
        <ContentCreateReply
          className="p-0 border-none"
          setShowModalReply={setShow}
          post={post}
          setContent={setContent}
        />
      </BottomSheetUI.Root>
      <BottomSheet.Draft show={draft} setShow={setDraft} setClose={setShow} />
    </>
  );
}
