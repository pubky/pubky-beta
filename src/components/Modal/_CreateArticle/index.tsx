import { Modal } from '@social/ui-shared';
import ContentCreateArticle from './_Content';

interface CreateArticleProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateArticle({ showModal, setShowModal, setShowModalPost }: CreateArticleProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-h-[90vh] overflow-y-auto max-w-[1200px] scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div id="article-modal" className="flex flex-col gap-4">
        <Modal.Header title="New Article" />
        <ContentCreateArticle setShowModalArticle={setShowModal} setShowModalPost={setShowModalPost} />
      </div>
    </Modal.Root>
  );
}
