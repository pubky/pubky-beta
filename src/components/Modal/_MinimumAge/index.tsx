'use client';

import { Modal } from '@social/ui-shared';
import ContentMinimumAge from './_Content';

interface MinimumAgeProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MinimumAge({ showModal, setShowModal }: MinimumAgeProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="sm:w-[588px] max-h-[90vh] justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Age minimum: 18" />
      <ContentMinimumAge setShowModal={setShowModal} />
    </Modal.Root>
  );
}
