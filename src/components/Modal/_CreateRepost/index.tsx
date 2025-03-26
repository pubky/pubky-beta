'use client';

import { useState } from 'react';
import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentCreateRepost from './_Content';
import { useModal } from '@/contexts';

interface CreateRepostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function CreateRepost({ showModal, setShowModal, post }: CreateRepostProps) {
  const { openModal } = useModal();
  const [hasContent, setHasContent] = useState(false);

  const handleClose = () => {
    if (hasContent) {
      openModal('checkContent', { setShow2: setShowModal });
    } else {
      setShowModal(false);
    }
  };

  return (
    <Modal.Root
      show={showModal}
      closeModal={handleClose}
      className="md:w-[792px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={handleClose} />
      <div className="mb-6">
        <Modal.Header title="Repost" />
      </div>
      <ContentCreateRepost setShowModalRepost={setShowModal} post={post} setHasContent={setHasContent} />
    </Modal.Root>
  );
}
