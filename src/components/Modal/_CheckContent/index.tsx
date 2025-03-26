import { Modal } from '@social/ui-shared';
import ContentCheck from './_Content';

interface CheckContentProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShow2: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CheckContent({ showModal, setShowModal, setShow2 }: CheckContentProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Do you want to close it?" />
      <ContentCheck setShow={setShowModal} setShow2={setShow2} />
    </Modal.Root>
  );
}
