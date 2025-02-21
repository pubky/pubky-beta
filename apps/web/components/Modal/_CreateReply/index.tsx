import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentCreateReply from './_Content';

interface CreateReplyProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function CreateReply({
  showModal,
  setShowModal,
  post,
}: CreateReplyProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[792px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="mb-4">
        <Modal.Header title="Reply" />
      </div>
      <ContentCreateReply setShowModalReply={setShowModal} post={post} />
    </Modal.Root>
  );
}
