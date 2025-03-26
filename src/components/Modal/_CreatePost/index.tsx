'use client';

import { useState } from 'react';
import { Modal } from '@social/ui-shared';
import ContentCreatePost from './_Content';
import { useModal } from '@/contexts';

interface CreatePostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreatePost({ showModal, setShowModal }: CreatePostProps) {
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
      className="md:w-[792px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={handleClose} />
      <div className="flex flex-col gap-4">
        <Modal.Header title="New Post" />
        <div className="flex items-center relative">
          <ContentCreatePost setShowModalPost={setShowModal} setHasContent={setHasContent} />
        </div>
      </div>
    </Modal.Root>
  );
}
