'use client';

import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentReportPost from './components/_Content';

interface ReportPostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalReportPostRef: React.RefObject<HTMLDivElement>;
  post: PostView;
}

export default function ReportPost({
  showModal,
  setShowModal,
  modalReportPostRef,
  post,
}: ReportPostProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      modalRef={modalReportPostRef}
      className="lg:w-[588px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentReportPost setShowModal={setShowModal} post={post} />
    </Modal.Root>
  );
}
