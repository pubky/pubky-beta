import { Modal } from '@social/ui-shared';
import ContentCheckLink from './_Content';

interface CheckLinkProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  clickedLink: string;
}

export default function CheckLink({ showModal, setShowModal, clickedLink }: CheckLinkProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Double-check this link" />
      <ContentCheckLink setShow={setShowModal} clickedLink={clickedLink} />
    </Modal.Root>
  );
}
