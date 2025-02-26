'use client';

import { Modal } from '@social/ui-shared';
import ContentLink from './_Content';
import { Links } from '@/types/Post';

interface LinkProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLinks: any;
  links: Links[];
}

export default function Link({ showModal, setShowModal, setLinks, links }: LinkProps) {
  return (
    <Modal.Root
      show={showModal}
      closeModal={() => setShowModal(false)}
      className="sm:w-[592px] max-h-[90vh] min-h-[465px] justify-start"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <Modal.Header id="add-profile-link-header" title="Add Profile Link" />
      <ContentLink setShowModalLink={setShowModal} links={links} setLinks={setLinks} />
    </Modal.Root>
  );
}
