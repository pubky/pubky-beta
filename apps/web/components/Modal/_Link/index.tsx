'use client';

import { Modal } from '@social/ui-shared';
import ContentLink from './_Content';

interface LinkProps {
  showModalLink: boolean;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
  modalLinkRef: React.RefObject<HTMLDivElement>;
  onAddLink: (title: string, url: string) => void;
}

export default function Link({
  showModalLink,
  setShowModalLink,
  modalLinkRef,
  onAddLink,
}: LinkProps) {
  return (
    <Modal.Root
      show={showModalLink}
      closeModal={() => setShowModalLink(false)}
      modalRef={modalLinkRef}
      className="sm:w-[592px] h-[480px] justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModalLink(false)} />
      <Modal.Header id="add-profile-link-header" title="Add Profile Link" />
      <ContentLink setShowModalLink={setShowModalLink} onAddLink={onAddLink} />
    </Modal.Root>
  );
}
