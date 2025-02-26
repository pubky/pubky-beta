import { Modal } from '@social/ui-shared';
import ContentDeleteAccount from './_Content';

interface DeleteAccountProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteAccount({ showModal, setShowModal }: DeleteAccountProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Delete Account" />
      <ContentDeleteAccount setShowModalDeleteAccount={setShowModal} />
    </Modal.Root>
  );
}
