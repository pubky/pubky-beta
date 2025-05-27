import { Modal } from '@social/ui-shared';
import ContentTermsOfService from './_Content';

interface TermsOfServiceProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TermsOfService({ showModal, setShowModal }: TermsOfServiceProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="sm:w-[792px] max-h-[90vh] min-h-[465px] justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Terms of Service" />
      <ContentTermsOfService setShowModal={setShowModal} />
    </Modal.Root>
  );
}
