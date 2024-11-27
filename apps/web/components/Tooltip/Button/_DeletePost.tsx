'use client';

import { useState } from 'react';
import { Icon, Tooltip } from '@social/ui-shared';
import { useAlertContext, usePubkyClientContext } from '@/contexts';
import { PostView } from '@/types/Post';
import Modal from '@/components/Modal';

interface DeletePostProps {
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeletePost({ post, setShowMenu }: DeletePostProps) {
  const { pubky, deletePost, deleteFile } = usePubkyClientContext();
  const [showModalDeletePost, setShowModalDeletePost] = useState(false);
  const { setContent, setShow } = useAlertContext();

  const handleDeletePost = async () => {
    try {
      if (post?.details?.attachments) {
        const fileDeletions = Object.values(post?.details?.attachments).map(
          async (file) => {
            await deleteFile(file);
          }
        );
        await Promise.all(fileDeletions);
      }

      const result = await deletePost(post?.details?.id);

      if (result) {
        setContent('Post deleted successfully');
      } else {
        setContent('Something wrong. Try again', 'warning');
      }
      setShow(true);
    } catch (error) {
      console.log(error);
    } finally {
      setShowMenu(false);
    }
  };

  return (
    <>
      {post?.details.author === pubky && (
        <Tooltip.Item
          id="delete-post"
          onClick={() => setShowModalDeletePost(true)}
          icon={<Icon.Trash size="24" color={'#EF4444'} />}
          cssText="text-red-500"
        >
          Delete post
        </Tooltip.Item>
      )}

      <Modal.DeletePost
        showModalDeletePost={showModalDeletePost}
        setShowModalDeletePost={setShowModalDeletePost}
        handleDeletePost={handleDeletePost}
      />
    </>
  );
}
