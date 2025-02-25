'use client';

import { Modal } from '@social/ui-shared';
import ContentJoin from './_Content';

interface ModalJoinProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Join({ showModal, setShowModal }: ModalJoinProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="md:max-w-[792px] max-h-[600px] md:max-h-full overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Join Pubky" />
      <ContentJoin closeJoin={() => setShowModal(false)} />
    </Modal.Root>
  );
}
