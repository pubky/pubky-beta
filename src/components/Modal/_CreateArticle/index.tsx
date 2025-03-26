'use client';

import { useState } from 'react';
import { Modal } from '@social/ui-shared';
import ContentCreateArticle from './_Content';
import { useModal } from '@/contexts';

interface CreateArticleProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateArticle({ showModal, setShowModal, setShowModalPost }: CreateArticleProps) {
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
      className="max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={handleClose} />
      <div id="article-modal" className="flex flex-col gap-4">
        <Modal.Header title="New Article" />
        <ContentCreateArticle
          setShowModalArticle={setShowModal}
          setShowModalPost={setShowModalPost}
          setHasContent={setHasContent}
        />
      </div>
    </Modal.Root>
  );
}
