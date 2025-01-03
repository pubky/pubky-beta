'use client';

import { BottomSheet, Button, Icon, Typography } from '@social/ui-shared';

interface DeletePostProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletePost: () => void;
  title?: string;
  className?: string;
}

export default function DeletePost({
  show,
  setShow,
  handleDeletePost,
  title,
  className,
}: DeletePostProps) {
  return (
    <BottomSheet.Root
      show={show}
      setShow={setShow}
      title={title ?? 'Delete Post'}
      className={className}
    >
      <Typography.Body className="text-opacity-60 my-4" variant="medium">
        Are you sure you want to delete this post?
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Button.Large
          id="cancel-btn"
          variant="secondary"
          onClick={() => setShow(false)}
        >
          Cancel
        </Button.Large>
        <Button.Large
          id="delete-post-btn"
          icon={<Icon.Trash size="16" />}
          onClick={() => {
            handleDeletePost();
            setShow(false);
          }}
        >
          Delete Post
        </Button.Large>
      </div>
    </BottomSheet.Root>
  );
}
