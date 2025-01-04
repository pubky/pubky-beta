'use client';

import { Button, Icon, Modal, Typography } from '@social/ui-shared';

interface DeletePostProps {
  setShowModalDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletePost: () => void;
}

export default function ContentDeletePost({
  setShowModalDeletePost,
  handleDeletePost,
}: DeletePostProps) {
  return (
    <>
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
    </>
  );
}
