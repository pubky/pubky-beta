'use client';

import { Modal, Typography } from '@social/ui-shared';
import { useRef } from 'react';

interface ServerDownProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ServerDown({
  showModal,
  setShowModal,
}: ServerDownProps) {
  const modalServerDownRef = useRef<HTMLDivElement>(null);

  return (
    <Modal.Root
      show={showModal}
      modalRef={modalServerDownRef}
      className="max-w-[1200px] md:min-w-[588px] max-h-[600px] overflow-y-auto"
    >
      <Modal.Header title="Server down" />
      <Typography.Body className="text-opacity-60" variant="medium">
        Please check your internet connection or contact the team for assistance
      </Typography.Body>
    </Modal.Root>
  );
}
