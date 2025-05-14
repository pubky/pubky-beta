'use client';

import { Modal } from '@social/ui-shared';
import ContentConnectionLost from './_Content';

interface ConnectionLostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConnectionLost({ showModal, setShowModal }: ConnectionLostProps) {
  return (
    <Modal.Root
      show={showModal}
      fixed
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <div className="mb-4">
        <Modal.Header title="Connection lost" />
      </div>
      <ContentConnectionLost />
    </Modal.Root>
  );
}
