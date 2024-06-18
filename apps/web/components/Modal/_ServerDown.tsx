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
      className="w-[480px]"
    >
      <Modal.Header title="Server down" />
      <Typography.Body className="text-opacity-60" variant="medium">
        Please contact the team for assistance
      </Typography.Body>
    </Modal.Root>
  );
}
