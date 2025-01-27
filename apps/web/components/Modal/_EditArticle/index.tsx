import { Modal as ModalUI } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { PostView } from '@/types/Post';
import ContentEditArticle from './_Content';
import Modal from '..';

interface CreateEditArticleProps {
  showModalEditArticle: boolean;
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
}

export default function EditArticle({
  showModalEditArticle,
  setShowModalEditArticle,
  article,
}: CreateEditArticleProps) {
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState(false);
  const modalEditArticleRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    if (content) {
      setDraft(true);
    } else {
      setShowModalEditArticle(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalEditArticleRef.current &&
        !modalEditArticleRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalEditArticleRef, content]);

  return (
    <>
      <ModalUI.Root
        modalRef={modalEditArticleRef}
        show={showModalEditArticle}
        closeModal={closeModal}
        className="md:w-[1200px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
      >
        <ModalUI.CloseAction onClick={closeModal} />
        <div className="flex flex-col gap-4">
          <ModalUI.Header title="Edit Article" />
          <ContentEditArticle
            setShowModalEditArticle={setShowModalEditArticle}
            article={article}
            setContent={setContent}
          />
        </div>
      </ModalUI.Root>
      <Modal.Draft
        showModal={draft}
        setShowModal={setDraft}
        setClose={setShowModalEditArticle}
      />
    </>
  );
}
