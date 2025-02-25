import { Modal } from '@social/ui-shared';
import ContentCreatePost from './_Content';

interface CreatePostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreatePost({
  showModal,
  setShowModal,
}: CreatePostProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[792px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="flex flex-col gap-4">
        <Modal.Header title="New Post" />
        <div className="flex items-center relative">
          <ContentCreatePost setShowModalPost={setShowModal} />
        </div>
      </div>
    </Modal.Root>
  );
}
