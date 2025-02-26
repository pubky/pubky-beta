'use client';

import { Modal } from '@social/ui-shared';
import ContentReportProfile from './Components/_Content';

interface ReportProfileProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  pk: string;
  name: string | undefined;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportProfile({ showModal, setShowModal, pk, name, setShowMenu }: ReportProfileProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="lg:w-[588px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentReportProfile setShowModal={setShowModal} pk={pk} name={name} setShowMenu={setShowMenu} />
    </Modal.Root>
  );
}
