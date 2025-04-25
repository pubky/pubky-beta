import { Modal } from '@social/ui-shared';
import ContentEditFeed from './_Content';
import { ICustomFeed } from '@/types';

interface EditFeedProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateFeeds: (feedToAdd: ICustomFeed, name: string) => void;
  feedToEdit: ICustomFeed;
  feedName: string;
}

export default function EditFeed({ showModal, setShowModal, handleUpdateFeeds, feedToEdit, feedName }: EditFeedProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[620px] max-h-[90vh] overflow-y-auto justify-start scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="mb-4">
        <Modal.Header title="Edit Feed" />
      </div>
      <ContentEditFeed
        handleUpdateFeeds={handleUpdateFeeds}
        setShowModalEditFeed={setShowModal}
        feedToEdit={feedToEdit}
        feedName={feedName}
      />
    </Modal.Root>
  );
}
