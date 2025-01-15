import { Modal } from '@social/ui-shared';
import ContentCreatePost from './_Content';

interface CreatePostProps {
  showModalPost: boolean;
  setShowModalPost: React.Dispatch<React.SetStateAction<boolean>>;
  modalPostRef: React.RefObject<HTMLDivElement>;
}

export default function CreatePost({
  showModalPost,
  setShowModalPost,
  modalPostRef,
}: CreatePostProps) {
  return (
    <Modal.Root
      modalRef={modalPostRef}
      show={showModalPost}
      closeModal={() => {
        setShowModalPost(false);
        //setArrayTags([]);
      }}
      className="md:w-[792px] max-h-[600px] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction
        onClick={() => {
          setShowModalPost(false);
          //setArrayTags([]);
          //setContent('');
        }}
      />
      <div className="flex flex-col gap-4">
        <Modal.Header title="New Post" />
        <div className="flex items-center relative">
          <ContentCreatePost setShowModalPost={setShowModalPost} />
        </div>
      </div>
    </Modal.Root>
  );
}
