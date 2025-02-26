'use client';

import { Modal } from '@social/ui-shared';
import ContentDeletePost from './_Content';
import { PostView } from '@/types/Post';

interface DeletePostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function DeletePost({ showModal, setShowModal, setShowMenu, post }: DeletePostProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Delete Post" />
      <ContentDeletePost setShowModalDeletePost={setShowModal} setShowMenu={setShowMenu} post={post} />
    </Modal.Root>
  );
}
