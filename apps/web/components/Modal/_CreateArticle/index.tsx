import { Modal } from '@social/ui-shared';
import { useEffect, useRef } from 'react';
import ContentCreateArticle from './_Content';

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

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalArticleRef.current &&
        !modalArticleRef.current.contains(event.target as Node)
      ) {
        setShowModalArticle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalArticleRef, setShowModalArticle]);

  return (
    <Modal.Root
      modalRef={modalArticleRef}
      show={showModalArticle}
      closeModal={() => {
        setShowModalArticle(false);
        //setArrayTags([]);
      }}
      className="max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalArticle(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div id="article-modal" className="flex flex-col gap-4">
        <Modal.Header title="New Article" />
        <ContentCreateArticle
          setShowModalArticle={setShowModalArticle}
          setShowModalPost={setShowModalPost}
        />
      </div>
    </Modal.Root>
  );
}
