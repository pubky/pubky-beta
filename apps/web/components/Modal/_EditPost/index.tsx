import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditPost from './_Content';

interface CreateEditPostProps {
  showModalEditPost: boolean;
  setShowModalEditPost: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  modalEditPostRef: React.RefObject<HTMLDivElement>;
}

export default function EditPost({
  showModalEditPost,
  setShowModalEditPost,
  modalEditPostRef,
  post,
}: CreateEditPostProps) {
  return (
    <Modal.Root
      modalRef={modalEditPostRef}
      show={showModalEditPost}
      closeModal={() => {
        setShowModalEditPost(false);
        //setArrayTags([]);
      }}
      className="md:w-[792px] max-h-[600px] overflow-y-auto max-w-[1200px]"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalEditPost(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div className="flex flex-col gap-4">
        <Modal.Header title="Edit Post" />
        <ContentEditPost
          setShowModalEditPost={setShowModalEditPost}
          post={post}
        />
      </div>
    </Modal.Root>
  );
}
