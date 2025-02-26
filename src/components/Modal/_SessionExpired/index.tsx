'use client';

import { Modal } from '@social/ui-shared';
import ContentSessionExpired from './_Content';

interface SessionExpiredProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SessionExpired({ showModal, setShowModal }: SessionExpiredProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <div className="mb-4">
        <Modal.Header title="Session expired" />
      </div>
      <ContentSessionExpired />
    </Modal.Root>
  );
}
