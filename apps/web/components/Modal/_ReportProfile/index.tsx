'use client';

import { Modal } from '@social/ui-shared';
import ContentReportProfile from './Components/_Content';

interface ReportProfileProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalReportPostRef: React.RefObject<HTMLDivElement>;
  pk: string;
  name: string | undefined;
}

export default function ReportProfile({
  showModal,
  setShowModal,
  modalReportPostRef,
  pk,
  name,
}: ReportProfileProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalReportPostRef}
      className="lg:w-[588px] max-w-[1200px] max-h-[600] overflow-y-auto"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentReportProfile setShowModal={setShowModal} pk={pk} name={name} />
    </Modal.Root>
  );
}
