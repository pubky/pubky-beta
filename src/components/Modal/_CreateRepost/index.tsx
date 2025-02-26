import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentCreateRepost from './_Content';

interface CreateRepostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function CreateRepost({ showModal, setShowModal, post }: CreateRepostProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[792px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="mb-6">
        <Modal.Header title="Repost" />
      </div>
      <ContentCreateRepost setShowModalRepost={setShowModal} post={post} />
    </Modal.Root>
  );
}
