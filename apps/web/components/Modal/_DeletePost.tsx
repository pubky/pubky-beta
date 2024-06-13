'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import { useEffect, useRef } from 'react';

interface DeletePostProps {
  showModalDeletePost: boolean;
  setShowModalDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletePost: () => void;
}

export default function DeletePost({
  showModalDeletePost,
  setShowModalDeletePost,
  handleDeletePost,
}: DeletePostProps) {
  const modalDeletePostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalDeletePost = (event: MouseEvent) => {
      if (
        modalDeletePostRef.current &&
        !modalDeletePostRef.current.contains(event.target as Node)
      ) {
        setShowModalDeletePost(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalDeletePost);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideModalDeletePost
      );
    };
  }, [modalDeletePostRef, setShowModalDeletePost]);
  return (
    <Modal.Root
      show={showModalDeletePost}
      closeModal={() => setShowModalDeletePost(false)}
      modalRef={modalDeletePostRef}
      className="w-[480px]"
    >
      <Modal.CloseAction onClick={() => setShowModalDeletePost(false)} />
      <Modal.Header title="Delete Post" />
      <Typography.Body className="text-opacity-60" variant="medium">
        Are you sure you want to delete this post?
      </Typography.Body>
      <div className="flex gap-4 mt-8">
        <Button.Large
          variant="secondary"
          onClick={() => setShowModalDeletePost(false)}
        >
          Cancel
        </Button.Large>
        <Modal.SubmitAction
          icon={<Icon.Trash size="16" />}
          onClick={() => {
            handleDeletePost();
            setShowModalDeletePost(false);
          }}
        >
          Yes, delete
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
