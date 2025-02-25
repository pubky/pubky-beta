import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditPost from './_Content';

interface CreateEditPostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
}

export default function EditPost({
  showModal,
  setShowModal,
  post,
}: CreateEditPostProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[792px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="flex flex-col gap-4">
        <Modal.Header title="Edit Post" />
        <ContentEditPost setShowModalEditPost={setShowModal} post={post} />
      </div>
    </Modal.Root>
  );
}
