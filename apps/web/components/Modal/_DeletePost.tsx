'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import { useEffect, useRef } from 'react';

interface DeletePostProps {
  showModalDeletePost: boolean;
  setShowModalDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletePost: () => void;
  modalDeletePostRef: React.RefObject<HTMLDivElement>;
}

export default function DeletePost({
  showModalDeletePost,
  setShowModalDeletePost,
  handleDeletePost,
  modalDeletePostRef,
}: DeletePostProps) {
  return (
    <Modal.Root
      show={showModalDeletePost}
      closeModal={() => setShowModalDeletePost(false)}
      modalRef={modalDeletePostRef}
      className="max-w-[1200px] md:min-w-[588px] max-h-[600px] overflow-y-auto"
    >
      <Modal.CloseAction onClick={() => setShowModalDeletePost(false)} />
      <Modal.Header title="Delete Post" />
      <Typography.Body className="text-opacity-60 my-4" variant="medium">
        Are you sure you want to delete this post?
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Button.Large
          id="cancel-btn"
          variant="secondary"
          onClick={() => setShowModalDeletePost(false)}
        >
          Cancel
        </Button.Large>
        <Modal.SubmitAction
          id="delete-post-btn"
          icon={<Icon.Trash size="16" />}
          onClick={() => {
            handleDeletePost();
            setShowModalDeletePost(false);
          }}
        >
          Delete Post
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
