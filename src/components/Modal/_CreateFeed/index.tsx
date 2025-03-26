import { Modal } from '@social/ui-shared';
import ContentCreateFeed from './_Content';

interface CreateFeedProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoadFeeds: any;
}

export default function CreateFeed({ showModal, setShowModal, handleLoadFeeds }: CreateFeedProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[620px] max-h-[90vh] overflow-y-auto justify-start scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="mb-4">
        <Modal.Header title="Create Feed" />
      </div>
      <ContentCreateFeed handleLoadFeeds={handleLoadFeeds} setShowModalCreateFeed={setShowModal} />
    </Modal.Root>
  );
}
