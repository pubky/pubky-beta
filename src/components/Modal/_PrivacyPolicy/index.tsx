'use client';

import { Modal } from '@social/ui-shared';
import ContentPrivacyPolicy from './_Content';

interface PrivacyPolicyProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PrivacyPolicy({ showModal, setShowModal }: PrivacyPolicyProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="sm:w-[792px] max-h-[90vh] min-h-[465px] justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Privacy Policy" />
      <ContentPrivacyPolicy setShowModal={setShowModal} />
    </Modal.Root>
  );
}
