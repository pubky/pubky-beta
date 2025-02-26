'use client';

import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';

interface DeletePostProps {
  setShowModalDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function ContentDeletePost({ setShowModalDeletePost, setShowMenu, post }: DeletePostProps) {
  const { deletePost } = usePubkyClientContext();
  const { addAlert } = useAlertContext();

  const handleDeletePost = async () => {
    try {
      // Close the menu optimistically before deleting the post
      setShowMenu(false);

      const result = await deletePost(post);

      if (result) {
        addAlert('Post deleted!');
      } else {
        addAlert('Something wrong. Try again', 'warning');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Typography.Body className="text-opacity-60 my-4" variant="medium">
        Are you sure you want to delete this post?
      </Typography.Body>
      <div className="flex gap-4 mt-2">
        <Button.Large id="cancel-btn" variant="secondary" onClick={() => setShowModalDeletePost(false)}>
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
