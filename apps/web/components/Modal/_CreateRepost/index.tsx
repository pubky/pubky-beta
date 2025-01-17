import { Modal } from '@social/ui-shared';
import { useEffect, useRef } from 'react';
import { PostView } from '@/types/Post';
import ContentCreateRepost from './_Content';

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
  const modalRepostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModals = (event: MouseEvent) => {
      if (
        modalRepostRef.current &&
        !modalRepostRef.current.contains(event.target as Node)
      ) {
        setShowModalRepost(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModals);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModals);
    };
  }, [modalRepostRef, setShowModalRepost]);

  return (
    <Modal.Root
      modalRef={modalRepostRef}
      show={showModalRepost}
      closeModal={() => {
        setShowModalRepost(false);
        //setArrayTags([]);
      }}
      className="md:w-[792px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalRepost(false);
          //setArrayTags([]);
          //setContentRepost('');
        }}
      />
      <div className="mb-6">
        <Modal.Header title="Repost" />
      </div>
      <ContentCreateRepost
        setShowModalRepost={setShowModalRepost}
        post={post}
      />
    </Modal.Root>
  );
}
