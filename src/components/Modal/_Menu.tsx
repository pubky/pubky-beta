import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentMenu from '../Tooltip/_Menu/_Content';

interface MenuProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  repost?: PostView;
}

export default function Menu({ showModal, setShowModal, post, repost }: MenuProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentMenu post={post} repost={repost} setShowMenu={setShowModal} />
    </Modal.Root>
  );
}
