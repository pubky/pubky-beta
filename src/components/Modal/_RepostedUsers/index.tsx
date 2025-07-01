'use client';

import { Modal } from '@social/ui-shared';
import ContentRepostedUsers from './_Content';

interface RepostedUsersProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  users?: string[];
}

export default function RepostedUsers({ showModal, setShowModal, users = [] }: RepostedUsersProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="sm:w-[500px] min-h-[200px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header title="Users who reposted" />
      <ContentRepostedUsers users={users} />
    </Modal.Root>
  );
}
