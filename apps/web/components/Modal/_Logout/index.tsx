import { Modal } from '@social/ui-shared';
import ContentLogout from './_Content';

interface LogoutProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Logout({ showModal, setShowModal }: LogoutProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Sign out?" />
      <ContentLogout />
    </Modal.Root>
  );
}
