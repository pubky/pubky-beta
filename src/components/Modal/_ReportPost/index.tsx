'use client';

import { Modal } from '@social/ui-shared';
import { PostView } from '@/types/Post';
import ContentReportPost from './components/_Content';

interface ReportPostProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostView;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportPost({ showModal, setShowModal, post, setShowMenu }: ReportPostProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="lg:w-[588px] max-w-[1200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <ContentReportPost setShowModal={setShowModal} post={post} setShowMenu={setShowMenu} />
    </Modal.Root>
  );
}
