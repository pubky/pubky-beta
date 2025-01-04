import { Modal } from '@social/ui-shared';
import { useEffect } from 'react';
import { PostView } from '@/types/Post';
import ContentEditArticle from './_Content';

interface CreateEditArticleProps {
  showModalEditArticle: boolean;
  setShowModalEditArticle: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  modalEditArticleRef: React.RefObject<HTMLDivElement>;
}

export default function EditArticle({
  showModalEditArticle,
  setShowModalEditArticle,
  modalEditArticleRef,
  article,
}: CreateEditArticleProps) {
  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalEditArticleRef.current &&
        !modalEditArticleRef.current.contains(event.target as Node)
      ) {
        setShowModalEditArticle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalEditArticleRef, setShowModalEditArticle]);

  return (
    <Modal.Root
      modalRef={modalEditArticleRef}
      show={showModalEditArticle}
      closeModal={() => {
        setShowModalEditArticle(false);
        //setArrayTags([]);
      }}
      className="md:w-[1200px] max-h-[600px] overflow-y-auto max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalEditArticle(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div className="flex flex-col gap-4">
        <Modal.Header title="Edit Article" />
        <ContentEditArticle
          setShowModalEditArticle={setShowModalEditArticle}
          article={article}
        />
      </div>
    </Modal.Root>
  );
}
