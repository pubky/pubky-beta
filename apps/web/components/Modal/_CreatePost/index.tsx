import { Modal as ModalUI } from '@social/ui-shared';
import ContentCreatePost from './_Content';
import { useEffect, useState } from 'react';
import Modal from '..';

interface CreatePostProps {
  showModalPost: boolean;
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  modalPostRef: React.RefObject<HTMLDivElement>;
}

export default function CreatePost({
  showModalPost,
  setShowModalPost,
  modalPostRef,
}: CreatePostProps) {
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState(false);

  const closeModal = () => {
    if (content) {
      setDraft(true);
    } else {
      setShowModalPost(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalPostRef.current &&
        !modalPostRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalPostRef, content]);

  return (
    <>
      <ModalUI.Root
        modalRef={modalPostRef}
        show={showModalPost}
        closeModal={closeModal}
        className="md:w-[792px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
      >
        <ModalUI.CloseAction onClick={closeModal} />
        <div className="flex flex-col gap-4">
          <ModalUI.Header title="New Post" />
          <div className="flex items-center relative">
            <ContentCreatePost
              setShowModalPost={setShowModalPost}
              setContent={setContent}
            />
          </div>
        </div>
      </ModalUI.Root>
      <Modal.Draft
        showModal={draft}
        setShowModal={setDraft}
        setClose={setShowModalPost}
      />
    </>
  );
}
