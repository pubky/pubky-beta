import { Modal } from '@social/ui-shared';
import ContentFeedback from './_Content';

interface FeedbackProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Feedback({ showModal, setShowModal }: FeedbackProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:w-[792px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentFeedback setShowModal={setShowModal} />
    </Modal.Root>
  );
}
