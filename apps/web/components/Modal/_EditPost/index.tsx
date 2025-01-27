import { Modal as ModalUI } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditPost from './_Content';
import { useEffect, useRef, useState } from 'react';
import Modal from '..';

interface CreateEditPostProps {
  showModalEditPost: boolean;
  setShowModalEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  handleCloseModal: () => void;
}

export default function EditPost({
  showModalEditPost,
  setShowModalEditPost,
  post,
  handleCloseModal,
}: CreateEditPostProps) {
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState(false);
  const modalEditPostRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    if (content) {
      setDraft(true);
    } else {
      setShowModalEditPost(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalEditPostRef.current &&
        !modalEditPostRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalEditPostRef, content]);

  return (
    <>
      <ModalUI.Root
        modalRef={modalEditPostRef}
        show={showModalEditPost}
        closeModal={closeModal}
        className="md:w-[792px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
      >
        <ModalUI.CloseAction onClick={closeModal} />
        <div className="flex flex-col gap-4">
          <ModalUI.Header title="Edit Post" />
          <ContentEditPost
            setShowModalEditPost={setShowModalEditPost}
            post={post}
            handleCloseModal={handleCloseModal}
            setContent={setContent}
          />
        </div>
      </ModalUI.Root>
      <Modal.Draft
        showModal={draft}
        setShowModal={setDraft}
        setClose={setShowModalEditPost}
      />
    </>
  );
}
