import { Modal as ModalUI } from '@social/ui-shared';
import { useEffect, useRef, useState } from 'react';
import { PostView } from '@/types/Post';
import ContentCreateRepost from './_Content';
import Modal from '..';

interface CreateRepostProps {
  showModalRepost: boolean;
  setShowModalRepost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function CreateRepost({
  showModalRepost,
  setShowModalRepost,
  post,
}: CreateRepostProps) {
  const [draft, setDraft] = useState(false);
  const [content, setContent] = useState(false);
  const modalRepostRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    if (content) {
      setDraft(true);
    } else {
      setShowModalRepost(false);
    }
  };

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalRepostRef.current &&
        !modalRepostRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalRepostRef, content]);

  return (
    <>
      <ModalUI.Root
        modalRef={modalRepostRef}
        show={showModalRepost}
        closeModal={closeModal}
        className="md:w-[792px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
      >
        <ModalUI.CloseAction onClick={closeModal} />
        <div className="mb-6">
          <ModalUI.Header title="Repost" />
        </div>
        <ContentCreateRepost
          setShowModalRepost={setShowModalRepost}
          post={post}
          setContent={setContent}
        />
      </ModalUI.Root>
      <Modal.Draft
        showModal={draft}
        setShowModal={setDraft}
        setClose={setShowModalRepost}
      />
    </>
  );
}
