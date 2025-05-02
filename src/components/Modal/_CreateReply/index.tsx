'use client';

import { useState } from 'react';
import { Modal } from '@social/ui-shared';
import { PostType, PostView } from '@/types/Post';
import ContentCreateReply from './_Content';
import { useModal } from '@/contexts';

interface CreateReplyProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  postType?: PostType;
}

export default function CreateReply({ showModal, setShowModal, post, postType }: CreateReplyProps) {
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
      <div className="mb-4">
        <Modal.Header title="Reply" />
      </div>
      <ContentCreateReply
        setShowModalReply={setShowModal}
        post={post}
        setHasContent={setHasContent}
        postType={postType}
      />
    </Modal.Root>
  );
}
