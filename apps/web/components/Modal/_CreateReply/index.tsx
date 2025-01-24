import { Modal as ModalUI } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { PostView } from '@/types/Post';
import ContentCreateReply from './_Content';
import Modal from '..';

interface CreateReplyProps {
  showModalReply: boolean;
  setShowModalReply: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function CreateReply({
  showModalReply,
  setShowModalReply,
  post,
}: CreateReplyProps) {
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState(false);
  const modalReplyRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    if (content) {
      setDraft(true);
    } else {
      setShowModalReply(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalReplyRef.current &&
        !modalReplyRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalReplyRef, content]);
  return (
    <>
    <ModalUI.Root
      modalRef={modalReplyRef}
      show={showModalReply}
      closeModal={closeModal}
      className="md:w-[792px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <ModalUI.CloseAction
        onClick={closeModal}
      />
      <div className="mb-4">
        <ModalUI.Header title="Reply" />
      </div>
      <ContentCreateReply setContent={setContent} setShowModalReply={setShowModalReply} post={post} />
    </ModalUI.Root>
    <Modal.Draft showModal={draft} setShowModal={setDraft} setClose={setShowModalReply}/>
    </>
  );
}
