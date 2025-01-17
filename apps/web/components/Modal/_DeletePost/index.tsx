'use client';

import { Modal } from '@social/ui-shared';
import ContentDeletePost from './_Content';

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
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModalDeletePost(false)} />
      <Modal.Header title="Delete Post" />
      <ContentDeletePost
        setShowModalDeletePost={setShowModalDeletePost}
        handleDeletePost={handleDeletePost}
      />
    </Modal.Root>
  );
}
