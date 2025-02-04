'use client';

import { Modal } from '@social/ui-shared';
import { useRef } from 'react';
import ContentSessionExpired from './_Content';

interface SessionExpiredProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SessionExpired({
  showModal,
  setShowModal,
}: SessionExpiredProps) {
  const modalSessionExpiredRef = useRef<HTMLDivElement>(null);

  return (
    <Modal.Root
      show={showModal}
      modalRef={modalSessionExpiredRef}
      className="max-w-[1200px] md:min-w-[588px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.Header title="Session expired" />
      <ContentSessionExpired show={showModal} setShow={setShowModal} />
    </Modal.Root>
  );
}
