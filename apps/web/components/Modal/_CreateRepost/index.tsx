import { Modal } from '@social/ui-shared';
import { useRef } from 'react';
import { PostView } from '@/types/Post';
import { useDrawerClickOutside } from '@/hooks/useDrawerClickOutside';
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
  useDrawerClickOutside(modalRepostRef, () => setShowModalRepost(false));

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
