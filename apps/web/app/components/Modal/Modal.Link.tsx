'use client';

import { Icon, Input, Modal } from '@social/ui-shared';

interface LinkProps {
  showModalLink: boolean;
  setShowModalPost?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalLink: React.Dispatch<React.SetStateAction<boolean>>;
  modalLinkRef: React.RefObject<HTMLDivElement>;
}

export default function Link({
  showModalLink,
  setShowModalPost,
  setShowModalLink,
  modalLinkRef,
}: LinkProps) {
  return (
    <Modal.Root
      show={showModalLink}
      closeModal={() => setShowModalLink(false)}
      modalRef={modalLinkRef}
      className="w-[480px]"
    >
      <Modal.CloseAction onClick={() => setShowModalLink(false)} />
      <Modal.Header title="Add link" />
      <div className="my-6">
        <Input.Label value="Url" />
        <Input.Text placeholder="Add link" />
      </div>
      <div className="w-full mt-4">
        <Modal.SubmitAction
          icon={<Icon.LinkSimple size="12" />}
          onClick={() => {
            setShowModalLink(false);
            setShowModalPost && setShowModalPost(true);
          }}
        >
          Add link
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
