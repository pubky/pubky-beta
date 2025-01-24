import { Modal as ModalUI } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import ContentCreateArticle from './_Content';
import Modal from '..';

interface CreateArticleProps {
  showModalArticle: boolean;
  setShowModalArticle: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateArticle({
  showModalArticle,
  setShowModalArticle,
  setShowModalPost,
}: CreateArticleProps) {
  const modalArticleRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState(false);

  const closeModal = () => {
    if (content) {
      setDraft(true);
    } else {
      setShowModalArticle(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalArticleRef.current &&
        !modalArticleRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModals);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalArticleRef, content]);

  return (
    <>
      <ModalUI.Root
        modalRef={modalArticleRef}
        show={showModalArticle}
        closeModal={closeModal}
        className="max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
      >
        <ModalUI.CloseAction onClick={closeModal} />
        <div className="flex flex-col gap-4">
          <ModalUI.Header title="New Article" />
          <ContentCreateArticle
            setShowModalArticle={setShowModalArticle}
            setShowModalPost={setShowModalPost}
            setContent={setContent}
          />
        </div>
      </ModalUI.Root>
      <Modal.Draft
        showModal={draft}
        setShowModal={setDraft}
        setClose={setShowModalArticle}
      />
    </>
  );
}
