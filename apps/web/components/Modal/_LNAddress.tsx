'use client';

import { useEffect, useRef } from 'react';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';

interface LNAddressProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  lnAddress?: string;
}

export default function LNAddress({
  showModal,
  setShowModal,
  lnAddress,
}: LNAddressProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [modalRef, setShowModal]);

  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalRef}
      className="w-[588px]"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Typography.Body variant="medium" className="text-opacity-80">
        {lnAddress}
      </Typography.Body>
      <Button.Medium
        variant="line"
        className="mt-4"
        icon={<Icon.File size="16" />}
      >
        Copy lightning address
      </Button.Medium>
    </Modal.Root>
  );
}
