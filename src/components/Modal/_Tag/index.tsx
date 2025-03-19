import { Modal } from '@social/ui-shared';
import { PostType, PostView } from '@/types/Post';
import ContentTag from './_Content';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  postType: PostType;
}

export default function Tag({ showModal, setShowModal, post, postType }: TagProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="w-full md:max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction id="close-btn" onClick={() => setShowModal(false)} />
      <div className="w-full items-stretch flex-col inline-flex gap-6">
        <Modal.Header title="Tag Post" />
        <Modal.Content className="flex flex-row w-full">
          <ContentTag post={post} postType={postType} />
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
