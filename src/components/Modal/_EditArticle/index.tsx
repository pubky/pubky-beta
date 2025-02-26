import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentEditArticle from './_Content';

interface CreateEditArticleProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  article: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditArticle({ showModal, setShowModal, article, setShowMenu }: CreateEditArticleProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[1200px] max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="flex flex-col gap-4">
        <Modal.Header title="Edit Article" />
        <ContentEditArticle setShowModalEditArticle={setShowModal} article={article} setShowMenu={setShowMenu} />
      </div>
    </Modal.Root>
  );
}
