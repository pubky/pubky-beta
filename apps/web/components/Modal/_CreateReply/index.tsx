import { Modal } from '@social/ui-shared';
import { useEffect, useRef } from 'react';
import { PostView } from '@/types/Post';
import ContentCreateReply from './_Content';

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
  const modalReplyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalReplyRef.current &&
        !modalReplyRef.current.contains(event.target as Node)
      ) {
        setShowModalReply(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalReplyRef, setShowModalReply]);

  return (
    <Modal.Root
      modalRef={modalReplyRef}
      show={showModalReply}
      closeModal={() => {
        setShowModalReply(false);
        //setArrayTags([]);
      }}
      className="md:w-[792px] max-w-[1200px] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalReply(false);
          //setArrayTags([]);
          //setContentReply('');
        }}
      />
      <div className="mb-4">
        <Modal.Header title="Reply" />
      </div>
      <ContentCreateReply setShowModalReply={setShowModalReply} post={post} />
    </Modal.Root>
  );
}
