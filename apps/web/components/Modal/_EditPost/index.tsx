import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditPost from './_Content';

interface CreateEditPostProps {
  showModalEditPost: boolean;
  setShowModalEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  modalEditPostRef: React.RefObject<HTMLDivElement>;
  handleCloseModal: () => void;
}

export default function EditPost({
  showModalEditPost,
  setShowModalEditPost,
  modalEditPostRef,
  post,
  handleCloseModal,
}: CreateEditPostProps) {
  return (
    <Modal.Root
      modalRef={modalEditPostRef}
      show={showModalEditPost}
      closeModal={() => setShowModalEditPost(false)}
      className="md:w-[792px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModalEditPost(false)} />
      <div className="flex flex-col gap-4">
        <Modal.Header title="Edit Post" />
        <ContentEditPost
          setShowModalEditPost={setShowModalEditPost}
          post={post}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </Modal.Root>
  );
}
